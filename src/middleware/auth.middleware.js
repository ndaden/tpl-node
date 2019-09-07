import {readFileSync} from 'fs';
import {verify} from 'jsonwebtoken';
import path from 'path';

const authenticationMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader != undefined) {
        const keyPath = path.resolve('./src/keys/public.key');
        const publicKey = readFileSync(keyPath, 'utf-8');
        const token = authHeader.split(' ')[1];
        verify(token, publicKey, (error, decoded) => {
            if (error) {
                console.log(error);
                res.status(403).send("Unauthorized");
            } else {
                next();
            }
        });
    } else {
        res.status(403).send("Unauthorized");
    }
}

export default authenticationMiddleware;