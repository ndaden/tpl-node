import User from '../models/User';
import { compareSync } from 'bcryptjs';
import { readFileSync } from 'fs';
import { sign } from 'jsonwebtoken';
import path from 'path';

import AuthenticationService from '../service/AuthenticationService';

const AuthenticationController = {
    authenticate(req, res) {
        User.find({ username: req.body.username }).exec()
            .then(result => {
                if (result.length > 0 && compareSync(req.body.password, result[0].password)) {
                    let user = result[0];
                    user.password = undefined;
                    user.isActive = undefined;
                    user.activationCode = undefined;
                    // SIGNING OPTIONS
                    const signOptions = {
                        issuer: 'Nabil Corp',
                        subject: user.email,
                        audience: 'localhost',
                        expiresIn: "3600000", //1 hour
                        algorithm: "RS512"
                    };

                    const keyPath = path.resolve('./src/keys/private.key');
                    const privateKEY = process.env.PRIVATE_KEY || readFileSync(keyPath, 'utf-8');

                    const token = sign(user.toJSON(), privateKEY, signOptions);
                    let response = { success: true, token: token, message: "Vous êtes connectés", redirect: req.query.redirect }
                    res.send(response);
                } else {
                    res.send({ success: false, message: "Nom d'utilisateur et/ou mot de passe invalide(s)" });
                }
            }, err => res.send({ success: false, message: "Technical error" }));
    },

    test(req, res) {
        AuthenticationService.DecryptAuthorizationToken(req.headers['authorization'], response => {
            res.send(response);
        });
    }
};

export default AuthenticationController;
