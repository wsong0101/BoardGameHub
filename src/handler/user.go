package handler

import (
	"net/http"
	"strconv"
	"github.com/gin-gonic/gin"
	"github.com/wsong0101/BoardGameHub/src/db"
)

func OnUserCollection(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}
	dbCon := db.Get()
	
	var user db.User
	user.ID = uint(id)
	if dbCon.First(&user).Error != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	if dbCon.Model(&user).Related(&user.Collections).Error != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{ "nickname": user.Nickname, "collection": user.Collections })
}