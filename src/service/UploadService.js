import multer from 'multer';
import aws from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import jimp from 'jimp';

import * as config from './config.js';

const UploadService = {
    init() {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => cb(null, 'dist/uploads'),
            filename: (req, file, cb) => cb(null, file.originalname)
        });

        return multer({
            dest: 'dist/uploads',
            limits: { fileSize: config.MAX_FILE_SIZE },
            fileFilter: (req, file, cb) => {
                const ext = path.extname(file.originalname);
                if (!config.IMAGE_FILE_TYPES.includes(ext)) {
                    return cb(new Error('Format de fichier non accepté.'))
                }
                cb(null, true);
            }
        });
    },
    uploadFileToAwsS3(filepath, originalName, cb) {
        aws.config.setPromisesDependency();
        aws.config.update({
            accessKeyId: config.AWS_S3_KEY_ID,
            secretAccessKey: config.AWS_S3_KEY_SECRET,
            region: config.AWS_REGION
          });
        
        const s3 = new aws.S3();

        let ext = '';
        const arr = originalName.split('.');
        if(arr.length > 1){
            ext = arr[arr.length - 1];
        }
        
        var params = {
            ACL: 'public-read',
            Bucket: config.AWS_BUCKET,
            Body: fs.createReadStream(filepath),
            Key: `userAvatar/${arr[0]}-${Date.now()}.${ext}`
          };

        s3.upload(params, (error, data) => {
            if(error) {
                console.log('Erreur Upload AWS S3 : ', error);
                cb(error, null);
            }

            if(data) {
                fs.unlinkSync(filepath);
                const locationUrl = data.Location;

                cb(null, {path: locationUrl});
            }
        });
    },
    async optimizeImage(path, width, quality) {
        const image = await jimp.read(path);
        await image.grayscale();
        await image.contrast(0.3);
        await image.brightness(0.3);
        await image.normalize();
        await image.resize(width, jimp.AUTO);
        await image.quality(quality);
        
        await image.writeAsync(path);
    }
}

export default UploadService;