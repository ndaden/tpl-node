import multer from 'multer';
import path from 'path';

import * as config from './config.js';

const UploadController = {
    init() {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => cb(null, 'dist/uploads'),
            filename: (req, file, cb) => cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        });

        return multer({
            storage,
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
    upload(req, res, next) {
        const file = req.file;
        if (!file) {
            const error = new Error('Veuillez selectionner un fichier à uploader.');
            error.httpStatusCode = 400;
            return next(error);
        }
        res.send(file);
    },
    get(req, res) {
        const filename = req.params.id;
        res.sendFile(__dirname + '/../dist/uploads/' + filename); //TODO
    }
};

export default UploadController;