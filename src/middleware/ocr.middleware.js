const ocrMiddleware = (worker) => {
    console.log('middleware:',worker);
    return (req, res, next) => {
        req.worker = worker;
        return next();
    }
};

export default ocrMiddleware;