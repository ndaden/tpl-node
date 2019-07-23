const testMiddleware = (req, res, next) => {
    console.log(req.connection.remoteAddress);
    console.log(req.url);
    console.log(req.session);
    console.log(req.user);
    if(req.headers['user-agent']){
        let useragent = req.headers['user-agent'];
        console.log(useragent);
        if(!useragent.includes('Trident') && !useragent.includes('Postman') && !req.headers['postman-token']){
            return next();
        }else {
            return res.status(404).send();
        }
    }
    return res.status(401).send();
};

export default testMiddleware;