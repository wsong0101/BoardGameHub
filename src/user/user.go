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
	Email      string `json:"username" binding:"required"`
	Nickname   string `json:"nickname" binding:"required"`
	Password   string `json:"password" binding:"required"`
	PasswordRe string `json:"passwordRe" binding:"required"`
}

type LoginInput struct {
	Email    string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type UpdateCollectionInput struct {
	ID     uint     `json:"id" binding:"required"`
	Type   string   `json:"type" binding:"required"`
	Score  int      `json:"score"`
	Memo   string   `json:"memo"`
	Status []string `json:"status"`
}

type CollectionCounts struct {
	Own        int
	PrevOwned  int
	ForTrade   int
	Want       int
	WantToBuy  int
	Wishlist   int
	Preordered int
}

type CollectionInfo struct {
	ID          uint
	PrimaryName string
	KoreanName  string
	Thumbnail   string
	Own         int
	PrevOwned   int
	ForTrade    int
	Want        int
	WantToBuy   int
	Wishlist    int
	Preordered  int
	Score       int
	Memo        string
	IsExistInDB bool
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
		return errors.New("이메일 중복")
	}
	dbCon.Model(&db.User{}).Where("nickname = ?", form.Nickname).Count(&count)
	if count > 0 {
		return errors.New("닉네임 중복")
	}

	dbCon.Create(&user)

	return nil
}

func LoginFromInput(c *gin.Context) (db.User, error) {
	dbCon := db.Get()
	var user db.User

	var input LoginInput
	if err := c.ShouldBind(&input); err != nil {
		return user, err
	}

	if err := dbCon.Where("email = ?", input.Email).First(&user).Error; err != nil {
		return user, errors.New("invalid email")
	}

	if err := util.ComparePassword(user.Password, input.Password); err != nil {
		return user, errors.New("invalid password")
	}

	return user, login(c, user.ID)
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
	if err := dbCon.First(&user, userID).Error; err != nil {
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

func GetNickname(ID uint) string {
	dbCon := db.Get()

	var user db.User
	user.ID = ID

	if err := dbCon.First(&user).Error; err != nil {
		return ""
	}

	return user.Nickname
}

func GetCollectionCount(userID uint) (CollectionCounts, error) {
	var collections []db.Collection
	var counts CollectionCounts

	dbCon := db.Get()
	if err := dbCon.Where("user_id = ?", userID).Find(&collections).Error; err != nil {
		return counts, err
	}

	for _, col := range collections {
		if col.Own > 0 {
			counts.Own++
		}
		if col.PrevOwned > 0 {
			counts.PrevOwned++
		}
		if col.ForTrade > 0 {
			counts.ForTrade++
		}
		if col.Want > 0 {
			counts.Want++
		}
		if col.WantToBuy > 0 {
			counts.WantToBuy++
		}
		if col.Wishlist > 0 {
			counts.Wishlist++
		}
		if col.Preordered > 0 {
			counts.Preordered++
		}
	}

	return counts, nil
}

func GetCollection(userID uint, category string, page int) ([]CollectionInfo, error) {
	var infos []CollectionInfo

	dbCon := db.Get()

	query := " AND " + category + " = 1"

	var collections []db.Collection
	if err := dbCon.Where("user_id = ?"+query, userID).Order("score desc, id").Offset((page - 1) * 50).Limit(50).Find(&collections).Error; err != nil {
		return infos, err
	}

	var itemIDs []uint
	idCollectionMap := make(map[uint]db.Collection)
	for _, col := range collections {
		itemIDs = append(itemIDs, col.ItemID)
		idCollectionMap[col.ItemID] = col
	}

	var items []db.Item
	if err := dbCon.Where("ID IN (?)", itemIDs).Find(&items).Select("id, primary_name, korean_name, thumbnail").Error; err != nil {
		return infos, err
	}

	for _, item := range items {
		col := idCollectionMap[item.ID]

		infos = append(infos, CollectionInfo{
			ID:          item.ID,
			PrimaryName: item.PrimaryName,
			KoreanName:  item.KoreanName,
			Thumbnail:   util.GetURL(item.Thumbnail),
			Own:         col.Own,
			PrevOwned:   col.PrevOwned,
			ForTrade:    col.ForTrade,
			Want:        col.Want,
			WantToBuy:   col.WantToBuy,
			Wishlist:    col.Wishlist,
			Preordered:  col.Preordered,
			Score:       col.Score,
			Memo:        col.Memo,
			IsExistInDB: true,
		})
	}

	return infos, nil
}

func GetItemCollection(userID uint, itemID uint) (db.Collection, error) {
	var info db.Collection

	dbCon := db.Get()

	if err := dbCon.Where("user_id = ? AND item_id = ?", userID, itemID).First(&info).Error; err != nil {
		return info, err
	}

	return info, nil
}

func UpdateCollection(c *gin.Context) error {
	var input UpdateCollectionInput
	if err := c.ShouldBind(&input); err != nil {
		return err
	}

	dbUser, err := GetSessionUser(c)
	if err != nil {
		return err
	}

	var collection db.Collection
	var count int

	dbCon := db.Get()
	dbCon.Where("user_id = ? AND item_id = ?", dbUser.ID, input.ID).First(&collection).Count(&count)

	if count < 1 {
		collection.UserID = dbUser.ID
		collection.ItemID = input.ID
	}

	switch input.Type {
	case "score":
		collection.Score = input.Score
	case "status":
		collection.Own = 0
		collection.PrevOwned = 0
		collection.ForTrade = 0
		collection.Want = 0
		collection.WantToBuy = 0
		collection.Wishlist = 0
		collection.Preordered = 0
		for _, s := range input.Status {
			switch s {
			case "own":
				collection.Own = 1
			case "prev_owned":
				collection.PrevOwned = 1
			case "for_trade":
				collection.ForTrade = 1
			case "want":
				collection.Want = 1
			case "want_to_buy":
				collection.WantToBuy = 1
			case "wishlist":
				collection.Wishlist = 1
			case "preordered":
				collection.Preordered = 1
			}
		}
	case "memo":
		collection.Memo = input.Memo
	}

	dbCon.Save(&collection)

	return nil
}
