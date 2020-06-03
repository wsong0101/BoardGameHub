package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/wsong0101/BoardGameHub/src/user"
)

func OnRegister(c *gin.Context) {
	var form user.RegisterForm
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}
	// 입력값 유효한지 여부 서버검사 필요.

	if form.Password != form.PasswordRe {
		c.JSON(http.StatusBadRequest, gin.H{"message": "두 패스워드가 일치하지 않습니다."})
		return
	}

	if err := user.CreateUserFromInput(form); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, "")
}

func OnLogin(c *gin.Context) {
	dbUser, err := user.LoginFromInput(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"Email":     dbUser.Email,
		"Nickname":  dbUser.Nickname,
		"ID":        dbUser.ID,
		"Authority": dbUser.Authority,
	})
}

func OnLogout(c *gin.Context) {
	if err := user.Logout(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "logout success"})
}

func OnSessionUser(c *gin.Context) {
	user, err := user.GetSessionUser(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"email": user.Email, "nickname": user.Nickname})
}
