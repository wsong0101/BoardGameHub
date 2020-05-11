package geek

import (
	"encoding/xml"
	"io/ioutil"
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
	Item []Item `xml:"item"`
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
