package handler

import (
	"net/http"
	"strconv"

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
		} else if element.ProposeType == "tag" {
			var tag db.Tag
			tag.ID = element.ProposeID
			dbCon.First(&tag).Select("PrimaryName")
			original = tag.PrimaryName
		}

		returns = append(returns, ReturnPropose{
			element,
			original,
		})
	}

	c.JSON(http.StatusOK, returns)
}

func OnProposeAccept(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	var propose db.Propose
	propose.ID = uint(id)

	dbCon := db.Get()
	dbCon.First(&propose)

	if propose.ProposeType == "name" {
		var item db.Item
		item.ID = propose.ProposeID
		dbCon.Find(&item)
		item.KoreanName = propose.Value
		err := dbCon.Save(&item).Error
		if err != nil {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}
	} else if propose.ProposeType == "tag" {
		var tag db.Tag
		tag.ID = propose.ProposeID
		dbCon.Find(&tag)
		tag.KoreanName = propose.Value
		err := dbCon.Save(&tag).Error
		if err != nil {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}
	}

	dbCon.Delete(&propose)

	c.JSON(http.StatusOK, "")
}

func OnProposeDelete(c *gin.Context) {
	idStr := c.Param("id")
	dbCon := db.Get()
	dbCon.Where("id = ?", idStr).Delete(db.Propose{})
	c.JSON(http.StatusOK, "")
}
