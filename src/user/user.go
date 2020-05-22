package user

import (
	"errors"
	"fmt"
	"log"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/wsong0101/BoardGameHub/src/config"
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

type ItemStatus struct {
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
	Status      ItemStatus
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
		return errors.New("email duplicated")
	}
	dbCon.Model(&db.User{}).Where("nickname = ?", form.Nickname).Count(&count)
	if count > 0 {
		return errors.New("nickname duplicated")
	}

	dbCon.Create(&user)

	return nil
}

func LoginFromInput(c *gin.Context, form LoginForm) (db.User, error) {
	dbCon := db.Get()
	var user db.User
	dbCon.Where("email = ?", form.Email).First(&user)
	if user.ID <= 0 {
		return user, errors.New("invalid email")
	}
	if err := util.ComparePassword(user.Password, form.Password); err != nil {
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

func GetNickname(ID uint) string {
	dbCon := db.Get()

	var user db.User
	user.ID = ID

	if err := dbCon.First(&user).Error; err != nil {
		return ""
	}

	return user.Nickname
}

func GetCollectionCount(userID uint) (ItemStatus, error) {
	var collections []db.Collection
	var counts ItemStatus

	dbCon := db.Get()
	if err := dbCon.Where("user_id = ?", userID).Find(&collections).Error; err != nil {
		return counts, err
	}

	for _, col := range collections {
		if col.Own > 0 {
			counts.Own += 1
		}
		if col.PrevOwned > 0 {
			counts.PrevOwned += 1
		}
		if col.ForTrade > 0 {
			counts.ForTrade += 1
		}
		if col.Want > 0 {
			counts.Want += 1
		}
		if col.WantToBuy > 0 {
			counts.WantToBuy += 1
		}
		if col.Wishlist > 0 {
			counts.Wishlist += 1
		}
		if col.Preordered > 0 {
			counts.Preordered += 1
		}
	}

	return counts, nil
}

func GetCollection(userID uint, category string, page int) ([]CollectionInfo, error) {
	var infos []CollectionInfo

	dbCon := db.Get()

	query := " AND " + category + " = 1"

	var collections []db.Collection
	if err := dbCon.Where("user_id = ?"+query, userID).Offset((page - 1) * 50).Limit(50).Find(&collections).Error; err != nil {
		return infos, err
	}

	var itemIDs []uint
	statusMap := make(map[uint]ItemStatus)
	for _, col := range collections {
		itemIDs = append(itemIDs, col.ItemID)
		statusMap[col.ItemID] = ItemStatus{
			Own:        col.Own,
			PrevOwned:  col.PrevOwned,
			ForTrade:   col.ForTrade,
			Want:       col.Want,
			WantToBuy:  col.WantToBuy,
			Wishlist:   col.Wishlist,
			Preordered: col.Preordered,
		}
	}

	var items []db.Item
	if err := dbCon.Where("ID IN (?)", itemIDs).Find(&items).Select("id, primary_name, korean_name, thumbnail").Error; err != nil {
		return infos, err
	}

	cfg := config.Get().AWS

	for _, item := range items {
		infos = append(infos, CollectionInfo{
			ID:          item.ID,
			PrimaryName: item.PrimaryName,
			KoreanName:  item.KoreanName,
			Thumbnail:   cfg.CDNURL + "/" + item.Thumbnail,
			Status:      statusMap[item.ID],
			IsExistInDB: true,
		})
	}

	return infos, nil
}
