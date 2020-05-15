package db

import "github.com/jinzhu/gorm"

type User struct {
	gorm.Model
	Email    string `gorm:"type:varchar(100);unique_index"`
	Nickname string `gorm:"type:varchar(30);unique_index"`
	Password string `gorm:"type:varchar(100)"`
}

type Tag struct {
	gorm.Model
	TagType      int    `gorm:"index"`
	PrimaryValue string `gorm:"type:varchar(100)"`
	KoreanValue  string `gorm:"type:varchar(100);index"`
}

type Item struct {
	gorm.Model
	PrimaryName              string `gorm:"type:varchar(100)"`
	KoreanName               string `gorm:"type:varchar(100);index"`
	YearPublished            int
	MinPlayers               int
	MaxPlayers               int
	BestNumPlayers           string `gorm:"type:varchar(10)"`
	RecommendNumPlayers      string `gorm:"type:varchar(10)"`
	NotRecommendedNumPlayers string `gorm:"type:varchar(10)"`
	PlayingTime              int
	MinPlayingTime           int
	MaxPlayingTime           int
	MinAge                   int
	LanguageDependency       int
}

func init() {
	db.AutoMigrate(&User{})
	db.AutoMigrate(&Item{})
}
