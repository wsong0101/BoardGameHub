package user

import (
	"errors"
	"fmt"
	"log"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/wsong0101/BoardGameHub/src/db"
	"github.com/wsong0101/BoardGameHub/src/util"
)

const (
	userkey = "userID"
)

type RegisterForm struct {
	Email      string `form:"inputEmail" binding:"required"`
	Nickname   string `form:"inputNickname" binding:"required"`
	Password   string `form:"inputPassword" binding:"required"`
	PasswordRe string `form:"inputPasswordRe" binding:"required"`
}

type LoginForm struct {
	Email    string `form:"inputEmail" binding:"required"`
	Password string `form:"inputPassword" binding:"required"`
}

func CreateUserFromInput(form RegisterForm) error {
	ePassword, err := util.Ecrypt(form.Password)
	if err != nil {
		return err
	}

	var user db.User
	user.Email = form.Email
	user.Nickname = form.Nickname
	user.Password = ePassword

	dbCon := db.Get()
	count := 0
	dbCon.Model(&db.User{}).Where("email = ?", form.Email).Count(&count)
	if count > 0 {
		return errors.New("email duplicated")
	}
	dbCon.Model(&db.User{}).Where("nickname = ?", form.Nickname).Count(&count)
	if count > 0 {
		return errors.New("nickname duplicated")
	}

	dbCon.Create(&user)

	return nil
}

func LoginFromInput(c *gin.Context, form LoginForm) error {
	dbCon := db.Get()
	var user db.User
	dbCon.Where("email = ?", form.Email).First(&user)
	if user.ID <= 0 {
		return errors.New("invalid email")
	}
	if err := util.ComparePassword(user.Password, form.Password); err != nil {
		return errors.New("invalid password")
	}

	return login(c, user.ID)
}

func GetSessionUser(c *gin.Context) (db.User, error) {
	var user db.User
	session := sessions.Default(c)
	value := session.Get(userkey)
	if value == nil {
		return user, nil
	}
	userID := value.(uint)

	dbCon := db.Get()
	dbCon.First(&user, userID)
	if user.Email == "" {
		log.Fatalln("user session contains invalid id " + fmt.Sprint(userID))
		return user, Logout(c)
	}
	return user, nil
}

func login(c *gin.Context, userID uint) error {
	session := sessions.Default(c)
	session.Set(userkey, userID)
	return session.Save()
}

func Logout(c *gin.Context) error {
	session := sessions.Default(c)
	session.Delete(userkey)
	return session.Save()
}
