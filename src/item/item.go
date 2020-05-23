package item

import "github.com/wsong0101/BoardGameHub/src/db"

func GetInfo(ID uint) (db.Item, error) {
	dbCon := db.Get()

	var item db.Item
	item.ID = ID

	if err := dbCon.First(&item).Error; err != nil {
		return item, err
	}

	return item, nil
}
