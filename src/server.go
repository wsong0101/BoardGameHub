package main

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"

	_ "github.com/wsong0101/BoardGameHub/src/db"
	"github.com/wsong0101/BoardGameHub/src/geek"
	"github.com/wsong0101/BoardGameHub/src/handler"
	"github.com/wsong0101/BoardGameHub/src/user"
)

func main() {
	r := gin.Default()
	store := cookie.NewStore([]byte("secret"))
	r.Use(sessions.Sessions("mysession", store))

	r.LoadHTMLGlob("../templates/*")

	r.GET("/", returnApp)
	r.GET("/register", returnApp)
	r.GET("/register/welcome", returnApp)
	r.GET("/login", returnApp)
	r.GET("/user/import", returnApp)
	r.GET("/user/collection/:id/*category", returnApp)
	r.GET("/item/create", returnApp)
	r.GET("/item/info/:id", returnApp)
	r.GET("/propose", returnApp)
	r.GET("/tag/info/:id", returnApp)

	loginAuth := r.Group("/")
	loginAuth.Use(AuthRequired)

	r.POST("/register", handler.OnRegister)
	r.POST("/login", handler.OnLogin)
	loginAuth.POST("/logout", handler.OnLogout)
	r.POST("/session/user", handler.OnSessionUser)

	loginAuth.POST("/user/import", geek.OnUserImport)
	r.POST("/user/collection/:id/:category/:page", handler.OnUserCollection)
	loginAuth.PUT("/user/collection", handler.OnCollectionUpdate)

	loginAuth.POST("/item/import", geek.OnItemImport)
	loginAuth.POST("/item/geekinfo", geek.ReturnGeekInfo)
	r.POST("/item/info/:id", handler.OnItem)
	loginAuth.POST("/propose", handler.OnPropose)
	r.POST("/tag/info/:id", handler.OnTag)

	adminAuth := r.Group("/admin/")
	adminAuth.Use(AdminRequired)
	adminAuth.GET("/", returnApp)
	adminAuth.POST("/proposes", handler.OnProposeList)
	adminAuth.PUT("/propose/:id", handler.OnProposeAccept)
	adminAuth.DELETE("/propose/:id", handler.OnProposeDelete)

	r.Static("/dist", "../dist")

	r.StaticFile("/favicon.ico", "../public/favicon.ico")
	r.StaticFile("/logo192.png", "../public/logo192.png")
	r.StaticFile("/logo512.png", "../public/logo512.png")
	r.StaticFile("/manifest.json", "../public/manifest.json")
	r.StaticFile("/robots.txt", "../public/robots.txt")

	r.Run(":8080") // 서버가 실행 되고 0.0.0.0:8080 에서 요청을 기다립니다.
}

func returnApp(c *gin.Context) {
	c.HTML(http.StatusOK, "index.html", gin.H{
		"title": "Welcome!",
	})
}

func AuthRequired(c *gin.Context) {
	_, err := user.GetSessionUser(c)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "login required"})
		return
	}

	c.Next()
}

func AdminRequired(c *gin.Context) {
	dbUser, err := user.GetSessionUser(c)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "login required"})
		return
	}

	if dbUser.Authority < 100 {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "auth required"})
		return
	}

	c.Next()
}
