package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/wsong0101/BoardGameHub/src/user"
)

func OnUserCollection(c *gin.Context) {
	idStr := c.Param("id")
	category := c.Param("category")
	pageStr := c.Param("page")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	page, err := strconv.Atoi(pageStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	nickname := user.GetNickname(uint(id))
	if nickname == "" {
		c.JSON(http.StatusBadRequest, "invalid user")
		return
	}

	counts, err := user.GetCollectionCount(uint(id))
	if err != nil {
		c.JSON(http.StatusBadRequest, "invalid user")
		return
	}

	collections, err := user.GetCollection(uint(id), category, page)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	c.JSON(http.StatusOK, gin.H{"nickname": nickname, "counts": counts, "collection": collections})
}
