package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type RegisterForm struct {
	Email      string `form:"inputEmail" binding:"required"`
	Nickname   string `form:"inputNickname" binding:"required"`
	Password   string `form:"inputPassword" binding:"required"`
	PasswordRe string `form:"inputPasswordRe" binding:"required"`
}

func OnRegister(c *gin.Context) {
	var form RegisterForm
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if form.Password != form.PasswordRe {
		c.JSON(http.StatusBadRequest, gin.H{"error": "password mismatch"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "registration success"})
}
