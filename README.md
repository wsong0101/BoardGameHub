# BoardGameHub
보드게임 데이터베이스 커뮤니티 사이트

## 설치방법

### config.yaml 을 / 디렉토리에 추가
```yaml
# Database credentials
database:
  host: "dbaddress"
  port: "5432"
  database: "dbname"
  user: "dbuser"
  password: "dbpassword"

aws:
  s3Region: "ap-northeast-2"
  s3Id: "secret id"
  s3SecretKey: "secret key"
  s3Bucket: "bucket name"
  cdnUrl: "cdn url (or s3 bucket)"
```
