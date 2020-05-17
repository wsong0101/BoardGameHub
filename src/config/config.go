package config

import (
	"log"
	"os"

	"gopkg.in/yaml.v2"
)

type Config struct {
	Database struct {
		Host     string `yaml:"host"`
		Port     string `yaml:"port"`
		Database string `yaml:"database"`
		User     string `yaml:"user"`
		Password string `yaml:"password"`
	} `yaml:"database"`

	AWS struct {
		S3Region    string `yaml:"s3Region"`
		S3Id        string `yaml:"s3Id"`
		S3SecretKey string `yaml:"s3SecretKey"`
		S3Bucket    string `yaml:"s3Bucket"`
		CDNURL      string `yaml:"cdnUrl"`
	} `yaml:"aws"`
}

var cfg *Config = nil

func processError(err error) {
	log.Println(err)
	os.Exit(2)
}

func init() {
	f, err := os.Open("../config.yaml")
	if err != nil {
		processError(err)
	}
	defer f.Close()

	decoder := yaml.NewDecoder(f)
	var tmpCfg Config
	err = decoder.Decode(&tmpCfg)
	if err != nil {
		processError(err)
	}
	cfg = &tmpCfg
}

func Get() *Config {
	return cfg
}
