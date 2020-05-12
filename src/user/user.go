package user

import (
	"errors"

	"github.com/wsong0101/BoardGameHub/src/db"
	"github.com/wsong0101/BoardGameHub/src/util"
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

func LoginFromInput(form LoginForm) error {
	dbCon := db.Get()
	var user db.User
	dbCon.Where("email = ?", form.Email).First(&user)
	if err := util.ComparePassword(user.Password, form.Password); err != nil {
		return errors.New("invalid auth")
	}

	return nil
}
