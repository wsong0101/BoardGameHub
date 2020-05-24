package item

import (
	"github.com/wsong0101/BoardGameHub/src/db"
	"github.com/wsong0101/BoardGameHub/src/util"
)

func GetInfo(ID uint) (db.Item, error) {
	dbCon := db.Get()

	var item db.Item
	item.ID = ID

	if err := dbCon.First(&item).Error; err != nil {
		return item, err
	}

	dbCon.Model(&item).Related(&item.Tags, "Tags")

	item.Thumbnail = util.GetURL(item.Thumbnail)

	return item, nil
}
