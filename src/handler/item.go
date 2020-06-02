package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/wsong0101/BoardGameHub/src/db"
	"github.com/wsong0101/BoardGameHub/src/item"
	"github.com/wsong0101/BoardGameHub/src/user"
)

type ProposeInput struct {
	Type  string `json:"type" binding:"required"`
	ID    int    `json:"id" binding:"required"`
	Value string `json:"value" binding:"required"`
}

func OnItem(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	item, err := item.GetInfo(uint(id))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	dbUser, err := user.GetSessionUser(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	var dbCol db.Collection
	if dbUser.ID > 0 {
		dbCol, err = user.GetItemCollection(dbUser.ID, uint(id))
		if err != nil {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"item": item, "collection": dbCol})
}

func OnPropose(c *gin.Context) {
	var input ProposeInput
	if err := c.ShouldBind(&input); err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	item.AddPropose(input.Type, uint(input.ID), input.Value)

	c.JSON(http.StatusOK, "")
}

func OnTag(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var tag db.Tag
	tag.ID = uint(id)

	dbCon := db.Get()
	dbCon.First(&tag)

	c.JSON(http.StatusOK, tag)
}
