package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.LoadHTMLGlob("templates/*")

	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{
			"title": "Welcome!",
		})
	})

	r.Static("/dist", "./dist")

	r.StaticFile("/favicon.ico", "./public/favicon.ico")
	r.StaticFile("/logo192.png", "./public/logo192.png")
	r.StaticFile("/logo512.png", "./public/logo512.png")
	r.StaticFile("/manifest.json", "./public/manifest.json")
	r.StaticFile("/robots.txt", "./public/robots.txt")

	r.Run(":8080") // 서버가 실행 되고 0.0.0.0:8080 에서 요청을 기다립니다.
}