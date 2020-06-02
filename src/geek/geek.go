package geek

import (
	"encoding/xml"
	"errors"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/abadojack/whatlanggo"
	"github.com/gin-gonic/gin"
	"github.com/wsong0101/BoardGameHub/src/common"
	"github.com/wsong0101/BoardGameHub/src/db"
	"github.com/wsong0101/BoardGameHub/src/user"
	"github.com/wsong0101/BoardGameHub/src/util"
)

const (
	maxRetryCount = 3
)

type ImportInput struct {
	GeekName string `json:"geekName" binding:"required"`
}

type ImportItemInput struct {
	GeekID int `json:"geekId" binding:"required"`
}

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
	Type    string `xml:"type,attr"`
	ID      int    `xml:"id,attr"`
	Value   string `xml:"value,attr"`
	InBound string `xml:"inbound,attr"`
}

type Item struct {
	GeekID        int    `xml:"id,attr"`
	ImageURL      string `xml:"image"`
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
	PrevOwned    int    `xml:"prevowned,attr"`
	ForTrade     int    `xml:"fortrade,attr"`
	Want         int    `xml:"want,attr"`
	WantToBuy    int    `xml:"wanttoplay,attr"`
	Wishlist     int    `xml:"wishlist,attr"`
	Preordered   int    `xml:"preordered,attr"`
	LastModified string `xml:"lastmodified,attr"`
}

type CollectionItem struct {
	GeekID    int        `xml:"objectid,attr"`
	Thumbnail string     `xml:"thumbnail"`
	Name      string     `xml:"name"`
	Status    ItemStatus `xml:"status"`
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
	var input ImportInput
	if err := c.ShouldBind(&input); err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	items, err := callUserImportAPI(input.GeekName, 0)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	dbUser, err := user.GetSessionUser(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	dbCon := db.Get()

	dbCon.Model(&dbUser).Association("Collections").Clear()
	dbUser.Collections = dbUser.Collections[:0]

	var collectionInfos []user.CollectionInfo

	for i := 0; i < len(items.Items); i++ {
		item := &items.Items[i]

		if (item.Status.Own == 0) && (item.Status.PrevOwned == 0) && (item.Status.ForTrade == 0) && (item.Status.Want == 0) && (item.Status.WantToBuy == 0) && (item.Status.Wishlist == 0) && (item.Status.Preordered == 0) {
			continue
		}

		var dbItem db.Item
		dbItem.ID = uint(item.GeekID)

		isExist := false
		if dbCon.First(&dbItem).RecordNotFound() == true {
			dbItem.PrimaryName = item.Name
			dbItem.Thumbnail = item.Thumbnail
		} else {
			dbItem.Thumbnail = util.GetURL(dbItem.Thumbnail)
			isExist = true
		}

		var collection db.Collection
		collection.ItemID = dbItem.ID
		collection.Own = item.Status.Own
		collection.PrevOwned = item.Status.PrevOwned
		collection.ForTrade = item.Status.ForTrade
		collection.Want = item.Status.Want
		collection.WantToBuy = item.Status.WantToBuy
		collection.Wishlist = item.Status.Wishlist
		collection.Preordered = item.Status.Preordered

		t, err := time.Parse("2006-01-02 15:04:05", item.Status.LastModified)
		if err != nil {
			t = time.Now()
		}
		collection.LastModified = t

		dbUser.Collections = append(dbUser.Collections, collection)

		collectionInfo := user.CollectionInfo{
			ID:          dbItem.ID,
			PrimaryName: dbItem.PrimaryName,
			Thumbnail:   dbItem.Thumbnail,
			Own:         collection.Own,
			PrevOwned:   collection.PrevOwned,
			ForTrade:    collection.ForTrade,
			Want:        collection.Want,
			WantToBuy:   collection.WantToBuy,
			Wishlist:    collection.Wishlist,
			Preordered:  collection.Preordered,
			IsExistInDB: isExist,
		}
		collectionInfos = append(collectionInfos, collectionInfo)
	}

	dbCon.Save(&dbUser)

	var collectionsToDelete []*db.Collection
	dbCon.Where("user_id IS NULL").Find(&collectionsToDelete)
	for _, col := range collectionsToDelete {
		dbCon.Delete(&col)
		dbCon.Unscoped().Delete(&col)
	}

	c.JSON(http.StatusOK, collectionInfos)
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

func importItemInfoFromGeek(id int) (db.Item, error) {
	var dbItem db.Item
	dbItem.ID = uint(id)

	dbCon := db.Get()
	if dbCon.First(&dbItem).RecordNotFound() == false {
		// The item already exists in Hub's DB.
		log.Printf("Item (%s) already exists.", dbItem.PrimaryName)
		// TODO: Implement item info update logic.
		return dbItem, nil
	}

	res, err := http.Get("https://www.boardgamegeek.com/xmlapi2/thing?id=" + strconv.Itoa(id))
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

	// Items' size must be 1
	for _, item := range items.Items {
		url, err := util.UploadToS3FromURL(item.ImageURL)
		if err != nil {
			log.Printf("Failed to upload image from url (%s)", item.ImageURL)
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
		dbItem.Thumbnail = strings.Replace(url, "origin/", "300/", 1)

		for _, link := range item.Links {
			var dbTag db.Tag
			dbTag.ID = uint(link.ID)
			dbTag.PrimaryName = link.Value

			if link.Type == "boardgamecategory" {
				dbTag.TagType = common.ItemCategory
			} else if link.Type == "boardgamemechanic" {
				dbTag.TagType = common.ItemMechanic
			} else if link.Type == "boardgamedesigner" {
				dbTag.TagType = common.ItemDesigner
			} else if link.Type == "boardgameartist" {
				dbTag.TagType = common.ItemArtist
			}

			if dbTag.TagType > 0 {
				dbItem.Tags = append(dbItem.Tags, &dbTag)
			}

			if link.Type == "boardgameexpansion" {
				if link.InBound == "true" {
					var expansion db.Item
					expansion.ID = uint(link.ID)
					dbItem.ExpansionFor = append(dbItem.ExpansionFor, &expansion)
				} else {
					var expansion db.Item
					expansion.ID = uint(link.ID)
					dbItem.Expansions = append(dbItem.Expansions, &expansion)
				}
			}
		}

		dbCon.Create(&dbItem)

		for _, expansion := range dbItem.Expansions {
			importItemInfoFromGeek(int(expansion.ID))
		}

		for _, expansion := range dbItem.ExpansionFor {
			importItemInfoFromGeek(int(expansion.ID))
		}
	}

	return dbItem, nil
}

func ReturnGeekInfo(c *gin.Context) {
	idStr := c.PostForm("geekId")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	item, err := importItemInfoFromGeek(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, item)
}

func OnItemImport(c *gin.Context) {
	var input ImportItemInput
	if err := c.ShouldBind(&input); err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	item, err := importItemInfoFromGeek(input.GeekID)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, item)
}
