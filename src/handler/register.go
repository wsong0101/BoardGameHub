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
