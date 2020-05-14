package geek

import (
	"encoding/xml"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
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

func OnUserImport(c *gin.Context) {
	username := c.PostForm("inputGeekUsername")
	res, err := http.Get("https://www.boardgamegeek.com/xmlapi2/collection?username=" + username)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid username"})
		return
	}
	defer res.Body.Close()

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "server error"})
		return
	}

	var items CollectionItems
	xmlerr := xml.Unmarshal(data, &items)
	if xmlerr != nil {
		log.Println(xmlerr.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": "server error"})
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
