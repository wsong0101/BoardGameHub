package geek

import (
	"encoding/xml"
	"errors"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
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

type Item struct {
	GeekId        int    `xml:"id,attr"`
	Thumbnail     string `xml:"thumbnail"`
	Name          []Name `xml:"name"`
	YearPublished Value  `xml:"yearpublished"`
	MinPlayers    Value  `xml:"minplayers"`
	MaxPlayers    Value  `xml:"maxplayers"`
	PlayingTime   Value  `xml:"playingtime"`
	MinPlayTime   Value  `xml:"minplaytime"`
	MaxPlayTime   Value  `xml:"maxplaytime"`
	MinAge        Value  `xml:"minage"`
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

	c.JSON(http.StatusOK, items)
}

func ReturnGeekInfo(c *gin.Context) {
	id := c.PostForm("geekId")
	res, err := http.Get("https://www.boardgamegeek.com/xmlapi2/thing?id=" + id)
	if err != nil {
		panic(err)
	}
	defer res.Body.Close()

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		panic(err)
	}

	var items Items
	xmlerr := xml.Unmarshal(data, &items)
	if xmlerr != nil {
		panic(err)
	}

	c.JSON(http.StatusOK, items)
}
