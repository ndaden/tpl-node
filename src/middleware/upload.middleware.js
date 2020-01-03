const uploadMiddleware = (req, res, next) => {
    const file = req.file;
        if (!file) {
            const error = new Error('Veuillez selectionner un fichier à uploader.');
            error.httpStatusCode = 400;
            return next(error);
        }
        res.send(file);
};

export default uploadMiddleware;