'use strict';

let aws = require('aws-sdk');
let s3 = new aws.S3({ apiVersion: '2006-03-01' });
let async = require('async');
let sharp = require('sharp');

const supportImageTypes = ["jpg", "jpeg", "png", "gif"];
const ThumbnailSizes = {
  IMAGE: [
    {size: 100, alias: '100', type: 'inside'},
    {size: 300, alias: '300', type: 'inside'},
  ],
  PROFILE: [    
    {size: 100, alias: '100', type: 'cover'},
    {size: 300, alias: '300', type: 'cover'},
  ],
  BADGE: [
    {size: 16, alias: '16', type: 'cover'},	  
    {size: 32, alias: '32', type: 'cover'},	  
  ],
  sizeFromKey: function(key) {
    if (key.startsWith('upload/image/')) {
      return ThumbnailSizes.IMAGE;
    } else if (key.startsWith('upload/profile/')) {
      return ThumbnailSizes.PROFILE;
    }
    return ThumbnailSizes.BADGE;
  }
}

function destKeyFromSrcKey(key, suffix) {
    return key.replace('origin/', `${suffix}/`)
}

function resizeAndUpload(response, size, srcKey, srcBucket, imageType, callback) {
    const pixelSize = size["size"];
    const resizeType = size["type"];

    async.waterfall(
        [
            function resize(next) {
	        sharp(response.Body)
		    .rotate()
	    	    .resize(pixelSize, pixelSize, { fit: resizeType })
	    	    .toFormat(imageType, { quality: 95 })
	    	    .toBuffer((err, data, info) => {
                	if (err) {
 		    	    next(err);
			} else {
		    	    next(null, response.ContentType, data);
			}
	    	    });
            },
            function upload(contentType, data, next) {
                const destKey = destKeyFromSrcKey(srcKey, size["alias"]);
                s3.putObject(
                    {
                        Bucket: srcBucket,
                        Key: destKey,
                        ACL: 'public-read',
                        Body: data,
                        ContentType: contentType
                    },
                    next
                );
            }
        ], (err) => {
            if (err) {
                callback(new Error(`resize to ${pixelSize} from ${srcKey} : ${err}`));
            } else {
              callback(null);
            }
        }
    )
}

exports.handler = (event, context, callback) => {
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    // Lambda 타임아웃 에러는 로그에 자세한 정보가 안남아서 S3 파일 이름으로 나중에 에러처리하기위해 에러를 출력하는 코드
    const timeout = setTimeout(() => {
        callback(new Error(`[FAIL]:${bucket}/${key}:TIMEOUT`));
    }, context.getRemainingTimeInMillis() - 500);

    if (!key.startsWith('upload/')) {
        clearTimeout(timeout);
        callback(new Error(`[FAIL]:${bucket}/${key}:Unsupported image path`));
        return;
    }

    const params = {
        Bucket: bucket,
        Key: key
    };
    const keys = key.split('.');
    const imageType = keys.pop().toLowerCase();
    if (!supportImageTypes.some((type) => { return type == imageType })) {
        clearTimeout(timeout);
        callback(new Error(`[FAIL]:${bucket}/${key}:Unsupported image type`));
        return;
    }

    async.waterfall(
        [
            function download(next) {
                s3.getObject(params, next);
            },
            function transform(response, next) {
                let sizes = ThumbnailSizes.sizeFromKey(key);
                if (sizes == null) {
                  next(new Error(`thumbnail type is undefined(allow articles or profiles), ${key}`));
                  return;
                }
                async.eachSeries(sizes, function (size, seriesCallback) {
                    resizeAndUpload(response, size, key, bucket, imageType, seriesCallback);
                }, next);
            }
        ], (err) => {
            if (err) {
                clearTimeout(timeout);
                callback(new Error(`[FAIL]:${bucket}/${key}:resize task ${err}`));
            } else {
                clearTimeout(timeout);
                callback(null, "complete resize");
            }
        }
    );
};
