package db

import (
	"log"
	"os"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"

	"github.com/wsong0101/BoardGameHub/src/config"
)

var db *gorm.DB = nil

func init() {
	cfg := config.Get().Database
	param := ""
	param = param + "host=" + cfg.Host
	param = param + " port=" + cfg.Port
	param = param + " user=" + cfg.User
	param = param + " dbname=" + cfg.Database
	param = param + " password=" + cfg.Password

	var err error
	db, err = gorm.Open("postgres", param)
	if err != nil {
		log.Println(err)
		os.Exit(2)
	}

	db.DB().SetMaxIdleConns(1)
	db.DB().SetMaxOpenConns(4)
}

func Get() *gorm.DB {
	return db
}

// 그레이스풀한 종료를 위한 무언가 필요?
