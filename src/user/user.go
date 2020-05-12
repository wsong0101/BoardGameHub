package user

import (
	"errors"

	"github.com/wsong0101/BoardGameHub/src/db"
)

type RegisterForm struct {
	Email      string `form:"inputEmail" binding:"required"`
	Nickname   string `form:"inputNickname" binding:"required"`
	Password   string `form:"inputPassword" binding:"required"`
	PasswordRe string `form:"inputPasswordRe" binding:"required"`
}

func CreateUserFromInput(form RegisterForm) error {
	var user db.User
	user.Email = form.Email
	user.Nickname = form.Nickname
	user.Password = form.Password

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
