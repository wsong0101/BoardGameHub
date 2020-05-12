package util

import (
	"golang.org/x/crypto/bcrypt"
)

func Ecrypt(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}

func ComparePassword(hashed string, input string) error {
	err := bcrypt.CompareHashAndPassword([]byte(hashed), []byte(input))
	return err
}
