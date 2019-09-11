import User from '../models/User';
import {compareSync} from 'bcryptjs';
import {readFileSync} from 'fs';
import {sign, verify} from 'jsonwebtoken';
import path from 'path';

const AuthenticationController = {
    authenticate(req, res){
        User.find({username: req.body.username}).exec()
        .then(result => {
            if(result.length > 0 && compareSync(req.body.password, result[0].password))
            {
                let user = result[0];
                user.password = undefined;

                // SIGNING OPTIONS
                const signOptions = {
                    issuer:  'Nabil Corp',
                    subject:  user.email,
                    audience:  'localhost',
                    expiresIn:  "3600000", //1 hour
                    algorithm:  "RS512"
                };

                const keyPath = path.resolve('./src/keys/private.key');
                const privateKEY  = readFileSync(keyPath, 'utf-8');

                const token = sign(user.toJSON(), privateKEY, signOptions);
                let response = { success: true, token: token, message: "Vous êtes connectés"}
                res.send(response);
            } else 
            {
                res.send({ success: false, message : "Nom d'utilisateur et/ou mot de passe invalide(s)" });
            }
        }, err => res.send({ success: false, message : "Technical error" }));
    },

    test(req, res){
        const authHeader = req.headers['authorization'];
        if(authHeader != undefined){
            const keyPath = path.resolve('./src/keys/public.key');
            const publicKey  = readFileSync(keyPath, 'utf-8');
            const token = authHeader.split(' ')[1];
            verify(token, publicKey, (error, decoded)=>{
                if(error){
                    console.log(error);
                    res.status(403).send("Unauthorized");
                } else {
                    res.send(decoded);
                }
            });
        } else {
            res.status(403).send("Unauthorized");
        }
    }
};

export default AuthenticationController;
