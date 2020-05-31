package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/wsong0101/BoardGameHub/src/db"
)

type ReturnPropose struct {
	db.Propose
	OriginalValue string
}

func OnProposeList(c *gin.Context) {
	dbCon := db.Get()
	var proposes []db.Propose
	dbCon.Find(&proposes)

	var returns []ReturnPropose
	for _, element := range proposes {
		var original string
		if element.ProposeType == "name" {
			var item db.Item
			item.ID = element.ProposeID
			dbCon.Find(&item).Select("PrimaryName")
			original = item.PrimaryName
		}

		returns = append(returns, ReturnPropose{
			element,
			original,
		})
	}

	c.JSON(http.StatusOK, returns)
}
