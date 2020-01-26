import User from '../models/User';
import { readFileSync } from 'fs';
import { verify } from 'jsonwebtoken';
import path from 'path';

const AuthenticationService = {
    DecryptAuthorizationToken(authHeader, cb) {
        if (authHeader != undefined) {
            const token = authHeader.split(' ')[1];
            const keyPath = path.resolve('./src/keys/public.key');
            const publicKey = process.env.PUBLIC_KEY || readFileSync(keyPath, 'utf-8');

            verify(token, publicKey, (error, decoded) => {
                if (error) {
                    return cb({ isAuthenticated: false, data: 'Unauthorized' });
                } else {
                    User.find({ _id: decoded._id }).then((user) => {
                        const response = {
                            username: decoded.username,
                            email: decoded.email,
                            isActive: user[0].isActive,
                            avatarUrl: user[0].avatarUrl,
                        };
                        return cb({ isAuthenticated: true, data: response });
                    });
                }
            });
        } else {
            return cb({ isAuthenticated: false, data: 'Unauthorized' });
        }
    }
};

export default AuthenticationService;