import UploadService from '../service/UploadService';

const uploadMiddleware = (req, res, next) => {
    const file = req.file;
        if (!file) {
            const error = new Error('Veuillez selectionner un fichier à uploader.');
            error.httpStatusCode = 400;
            return next(error);
        }
        UploadService.uploadFileToAwsS3(req.file.path, req.file.originalname, (error, result) => {
            res.send(result);
        });
        
};

export default uploadMiddleware;