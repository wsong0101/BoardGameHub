package util

import (
	"bytes"
	"errors"
	"io/ioutil"
	"log"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/globalsign/mgo/bson"
	"github.com/wsong0101/BoardGameHub/src/config"
)

var s3Session *session.Session

func init() {
	cfg := config.Get().AWS
	var err error
	s3Session, err = session.NewSession(&aws.Config{
		Region: aws.String(cfg.S3Region),
		Credentials: credentials.NewStaticCredentials(
			cfg.S3Id,
			cfg.S3SecretKey,
			"", // token can be left blank for now
		),
	})

	if err != nil {
		log.Fatalln("Failed to initialize s3 session")
	}
}

func UploadToS3FromURL(url string) (string, error) {
	res, err := http.Get(url)
	if err != nil {
		return "", errors.New("Invalid image url")
	}
	defer res.Body.Close()

	buffer, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return "", errors.New("Failed to read image")
	}

	splits := strings.Split(url, "/")
	fileName := splits[len(splits)-1]
	path := "image/origin/" + bson.NewObjectId().Hex() + filepath.Ext(fileName)

	err = putOubject(buffer, path)
	if err != nil {
		return "", errors.New("Failed to upload")
	}

	return path, nil
}

func putOubject(buffer []byte, path string) error {
	cfg := config.Get().AWS

	_, err := s3.New(s3Session).PutObject(&s3.PutObjectInput{
		Bucket:               aws.String(cfg.S3Bucket),
		Key:                  aws.String(path),
		ACL:                  aws.String("private"), // could be private if you want it to be access by only authorized users
		Body:                 bytes.NewReader(buffer),
		ContentLength:        aws.Int64(int64(len(buffer))),
		ContentType:          aws.String(http.DetectContentType(buffer)),
		ContentDisposition:   aws.String("attachment"),
		ServerSideEncryption: aws.String("AES256"),
		StorageClass:         aws.String("INTELLIGENT_TIERING"),
	})

	return err
}
