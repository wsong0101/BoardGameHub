package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/wsong0101/BoardGameHub/src/user"
)

func OnRegister(c *gin.Context) {
	var form user.RegisterForm
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// 입력값 유효한지 여부 서버검사 필요.

	if form.Password != form.PasswordRe {
		c.JSON(http.StatusBadRequest, gin.H{"error": "password mismatch"})
		return
	}

	if err := user.CreateUserFromInput(form); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "registration success"})
}

func OnLogin(c *gin.Context) {
	var form user.LoginForm
	if err := c.ShouldBind(&form); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := user.LoginFromInput(c, form); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "login success"})
}

func OnSessionUser(c *gin.Context) {
	user, err := user.GetSessionUser(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"nickname": user.Nickname, "email": user.Email})
}
