import AuthenticationService from '../service/AuthenticationService';

const authenticationMiddleware = (req, res, next) => {
    AuthenticationService.DecryptAuthorizationToken(req.headers['authorization'], response => {
        if (response.isAuthenticated) {
            return next();
        }
        return res.send({ success: false, message: 'Unauthorized' });
    });
}

export default authenticationMiddleware;