package db

import (
	"time"

	"github.com/jinzhu/gorm"
)

type User struct {
	gorm.Model
	Email       string `gorm:"type:varchar(100);unique_index"`
	Nickname    string `gorm:"type:varchar(30);unique_index"`
	Password    string `gorm:"type:varchar(100)"`
	Collections []Collection
	Authority   int
}

type Collection struct {
	gorm.Model
	UserID       uint
	ItemID       uint
	Own          int
	PrevOwned    int
	ForTrade     int
	Want         int
	WantToBuy    int
	Wishlist     int
	Preordered   int
	Score        int
	Memo         string
	LastModified time.Time
}

type Tag struct {
	gorm.Model
	TagType     int     `gorm:"index"`
	PrimaryName string  `gorm:"type:varchar(256)"`
	KoreanName  string  `gorm:"type:varchar(256);index"`
	Items       []*Item `gorm:"many2many:item_tags"`
}

type Item struct {
	gorm.Model
	PrimaryName              string `gorm:"type:varchar(256)"`
	KoreanName               string `gorm:"type:varchar(256);index"`
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
	Tags                     []*Tag  `gorm:"many2many:item_tags"`
	Expansions               []*Item `gorm:"many2many:expansions;association_jointable_foreignkey:expansion_id;association_autoupdate:false"`
	ExpansionFor             []*Item `gorm:"many2many:expansion_for;association_jointable_foreignkey:expansion_for_id;association_autoupdate:false"`
	Thumbnail                string  `gorm:"type:varchar(256)"`
}

type Propose struct {
	gorm.Model
	ProposeType string
	ProposeID   uint
	Value       string
}

func init() {
	db.AutoMigrate(&User{})
	db.AutoMigrate(&Collection{})
	db.AutoMigrate(&Item{})
	db.AutoMigrate(&Tag{})
	db.AutoMigrate(&Propose{})
}
