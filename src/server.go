package main

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"

	_ "github.com/wsong0101/BoardGameHub/src/db"
	"github.com/wsong0101/BoardGameHub/src/geek"
	"github.com/wsong0101/BoardGameHub/src/handler"
)

func main() {
	r := gin.Default()
	store := cookie.NewStore([]byte("secret"))
	r.Use(sessions.Sessions("mysession", store))

	r.LoadHTMLGlob("../templates/*")

	r.GET("/", returnApp)
	r.GET("/register", returnApp)
	r.GET("/login", returnApp)
	r.GET("/item/create", returnApp)

	r.POST("/register", handler.OnRegister)
	r.POST("/login", handler.OnLogin)
	r.POST("/session/user", handler.OnSessionUser)
	r.POST("/item/geekinfo", geek.ReturnGeekInfo)

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
