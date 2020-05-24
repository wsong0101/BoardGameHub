package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/wsong0101/BoardGameHub/src/db"
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

func flip(val int) int {
	if val == 0 {
		return 1
	}
	return 0
}

func OnCollectionUpdate(c *gin.Context) {
	idStr := c.Param("id")
	putType := c.Param("type")
	valueStr := c.PostForm("value")

	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	dbUser, err := user.GetSessionUser(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, err.Error())
		return
	}

	var collection db.Collection

	dbCon := db.Get()
	dbCon.Where("user_id = ? AND item_id = ?", dbUser.ID, id).First(&collection)

	if dbUser.ID != collection.UserID {
		c.JSON(http.StatusBadRequest, "invalid user")
		return
	}

	switch putType {
	case "score":
		value, err := strconv.Atoi(valueStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, err.Error())
			return
		}
		collection.Score = value
	case "own":
		collection.Own = flip(collection.Own)
	case "prev_owned":
		collection.PrevOwned = flip(collection.PrevOwned)
	case "for_trade":
		collection.ForTrade = flip(collection.ForTrade)
	case "want":
		collection.Want = flip(collection.Want)
	case "want_to_buy":
		collection.WantToBuy = flip(collection.WantToBuy)
	case "wishlist":
		collection.Wishlist = flip(collection.Wishlist)
	case "preordered":
		collection.Preordered = flip(collection.Preordered)
	case "memo":
		collection.Memo = valueStr
	default:
		c.JSON(http.StatusBadRequest, "invalid type")
		return
	}

	dbCon.Save(&collection)

	c.JSON(http.StatusOK, "")
}
