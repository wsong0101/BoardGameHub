package geek

import (
	"encoding/xml"
	"errors"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/abadojack/whatlanggo"
	"github.com/gin-gonic/gin"
	"github.com/wsong0101/BoardGameHub/src/db"
)

const (
	maxRetryCount = 3
)

type Name struct {
	Type  string `xml:"type,attr"`
	Value string `xml:"value,attr"`
}

type Value struct {
	Value int `xml:"value,attr"`
}

type Results struct {
	Results    []Result `xml:"result"`
	NumPlayers string   `xml:"numplayers,attr"`
}

type Result struct {
	Level    int    `xml:"level,attr"`
	Value    string `xml:"value,attr"`
	NumVotes int    `xml:"numvotes,attr"`
}

type Poll struct {
	Name    string    `xml:"name,attr"`
	Results []Results `xml:"results"`
}

type Link struct {
	Type  string `xml:"type,attr"`
	ID    string `xml:"id,attr"`
	Value string `xml:"value,attr"`
}

type Item struct {
	GeekId        int    `xml:"id,attr"`
	Thumbnail     string `xml:"thumbnail"`
	Names         []Name `xml:"name"`
	YearPublished Value  `xml:"yearpublished"`
	MinPlayers    Value  `xml:"minplayers"`
	MaxPlayers    Value  `xml:"maxplayers"`
	PlayingTime   Value  `xml:"playingtime"`
	MinPlayTime   Value  `xml:"minplaytime"`
	MaxPlayTime   Value  `xml:"maxplaytime"`
	MinAge        Value  `xml:"minage"`
	Polls         []Poll `xml:"poll"`
	Links         []Link `xml:"link"`
}

type Items struct {
	Items []Item `xml:"item"`
}

type ItemStatus struct {
	Own          int    `xml:"own,attr"`
	PreOwned     int    `xml:"preowned,attr"`
	ForTrade     int    `xml:"fortrade,attr"`
	Want         int    `xml:"want,attr"`
	WantToBuy    int    `xml:"wanttoplay,attr"`
	Wishlist     int    `xml:"wishlist,attr"`
	Preordered   int    `xml:"preordered,attr"`
	LastModified string `xml:"lastmodified,attr"`
}

type CollectionItem struct {
	GeekId int        `xml:"objectid,attr"`
	Status ItemStatus `xml:"status"`
}

type CollectionItems struct {
	Items []CollectionItem `xml:"item"`
}

func callUserImportAPI(username string, retry int) (CollectionItems, error) {
	var items CollectionItems

	if retry >= maxRetryCount {
		return items, errors.New("server error")
	}

	res, err := http.Get("https://www.boardgamegeek.com/xmlapi2/collection?username=" + username)
	if err != nil {
		return items, errors.New("boardgamegeek not responding")
	}
	defer res.Body.Close()

	if res.StatusCode == http.StatusAccepted {
		// Geek Collection API가 최초 시도 이후에 다시 요청해야 정상 동작하는 부분이 있어 N번까지는 재시도한다.
		log.Printf("Retrying import collection for user (%s), retry count = %d", username, retry+1)
		time.Sleep(time.Second * 3) // 성능 이슈가 발생할 경우 별도 고루틴을 사용하는 방법을 찾아본다.
		return callUserImportAPI(username, retry+1)
	}

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return items, errors.New("invalid response body")
	}

	xmlerr := xml.Unmarshal(data, &items)
	if xmlerr != nil {
		return items, errors.New("server error")
	}

	return items, nil
}

func OnUserImport(c *gin.Context) {
	username := c.PostForm("inputGeekUsername")

	items, err := callUserImportAPI(username, 0)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	// Get item info from geek if not exist in Hub's DB.
	// for index, item := range items.Items {
	// 	var dbItem db.item

	// }

	c.JSON(http.StatusOK, items)
}

func getKoreanName(names []Name) string {
	for _, name := range names {
		info := whatlanggo.DetectLang(name.Value)
		if info == whatlanggo.Kor {
			return name.Value
		}
	}
	return ""
}

func getBestNumPlayers(polls []Poll) (string, string, string) {
	for _, poll := range polls {
		if poll.Name != "suggested_numplayers" {
			continue
		}
		bestVote := 0
		bestVal := ""
		recomVote := 0
		recomVal := ""
		notVote := 0
		notVal := ""
		for _, result := range poll.Results {
			numVotes := 0
			value := ""
			for _, res := range result.Results {
				if numVotes < res.NumVotes {
					numVotes = res.NumVotes
					value = res.Value
				}
			}
			if value == "Best" {
				if numVotes > bestVote {
					bestVote = numVotes
					bestVal = result.NumPlayers
				}
			} else if value == "Recommended" {
				if numVotes > recomVote {
					recomVote = numVotes
					recomVal = result.NumPlayers
				}
			} else if value == "Not Recommended" {
				if numVotes > notVote {
					notVote = numVotes
					notVal = result.NumPlayers
				}
			}
		}
		return bestVal, recomVal, notVal
	}
	return "", "", ""
}

func getLanguageDependency(polls []Poll) int {
	for _, poll := range polls {
		if poll.Name != "language_dependence" {
			continue
		}
		vote := 0
		level := 0
		for _, result := range poll.Results {
			for _, res := range result.Results {
				if res.NumVotes > vote {
					vote = res.NumVotes
					level = res.Level
				}
			}
		}
		return level
	}
	return -1
}

func importItemInfoFromGeek(id string) (db.Item, error) {
	var dbItem db.Item

	res, err := http.Get("https://www.boardgamegeek.com/xmlapi2/thing?id=" + id)
	if err != nil {
		return dbItem, err
	}
	defer res.Body.Close()

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return dbItem, err
	}

	var items Items
	xmlerr := xml.Unmarshal(data, &items)
	if xmlerr != nil {
		log.Println(xmlerr.Error())
		return dbItem, err
	}

	dbCon := db.Get()

	for _, item := range items.Items {
		dbItem.ID = uint(item.GeekId)
		if dbCon.First(&dbItem).RecordNotFound() == false {
			// The item already exists in Hub's DB.
			log.Printf("Item (%s) already exists.", item.Names[0].Value)
			// TODO: Implement item info update logic.
			dbCon.First(&dbItem)
			return dbItem, nil
		}

		dbItem.PrimaryName = item.Names[0].Value
		dbItem.KoreanName = getKoreanName(item.Names)
		dbItem.YearPublished = item.YearPublished.Value
		dbItem.MinPlayers = item.MinPlayers.Value
		dbItem.MaxPlayers = item.MaxPlayers.Value
		dbItem.BestNumPlayers, dbItem.RecommendNumPlayers, dbItem.NotRecommendedNumPlayers = getBestNumPlayers(item.Polls)
		dbItem.PlayingTime = item.PlayingTime.Value
		dbItem.MinPlayingTime = item.MinPlayTime.Value
		dbItem.MaxPlayingTime = item.MaxPlayTime.Value
		dbItem.MinAge = item.MinAge.Value
		dbItem.LanguageDependency = getLanguageDependency(item.Polls)

		dbCon.Create(&dbItem)

		// TODO: Implement import Links into Tags.
	}

	return dbItem, nil
}

func ReturnGeekInfo(c *gin.Context) {
	id := c.PostForm("geekId")
	item, err := importItemInfoFromGeek(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
	}

	c.JSON(http.StatusOK, item)
}
