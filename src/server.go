package main

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/wsong0101/BoardGameHub/src/geek"
)

func main() {
	r := gin.Default()
	r.LoadHTMLGlob("../templates/*")

	r.GET("/", returnApp)
	r.GET("/item/create", returnApp)

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
