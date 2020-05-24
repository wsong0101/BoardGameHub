package util

import "github.com/wsong0101/BoardGameHub/src/config"

func GetURL(src string) string {
	cfg := config.Get().AWS
	return cfg.CDNURL + "/" + src
}
