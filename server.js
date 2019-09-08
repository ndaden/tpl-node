import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import passport from 'passport';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Strategy as LocalStrategy } from 'passport-local';

import ReflectionController from './src/controllers/ReflectionController';
import UserController from './src/controllers/UserController';
import AuthentificationController from './src/controllers/AuthenticationController';

import testMiddleware from './src/middleware/test.middleware';
import authMiddleware from './src/middleware/auth.middleware';
import AuthenticationController from './src/controllers/AuthenticationController';

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost/users', {useNewUrlParser: true })
        .then(() => console.log('Connected to MongoDB !'))
        .catch(error => console.log(error));

mongoose.set('useCreateIndex', true);

const corsOptions = {
    origin: 'http://localhost:8080',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(passport.session());

passport.use('local', new LocalStrategy(
    (username, password, done) => {
        UserController.authenticateUser(username, password, (error, user)=>
        {
            if(error){
                return done(error)
            }
            return done(null, user);
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    UserController.getUserById(id, (err, user)=> done(err,user));
});

app.post('/login',
    passport.authenticate('local'),
    (req, res) => {
        console.log("CONNECTE : " + req.user);
        req.logIn(req.user, err => {
            if(err){
            console.log("ERROR Login: " + err)
            }
            return res.redirect('/api/v1/users');
        });
        
    });

app.get('/', (req, res) => {
    return res.status(200).send({ 'message': 'Hello world from Express JS blah !' });
});

app.post('/api/v1/reflections', [testMiddleware, ReflectionController.create]);
app.get('/api/v1/reflections', [testMiddleware, ReflectionController.getAll]);
app.get('/api/v1/reflections/:id', [testMiddleware, ReflectionController.getOne]);
app.delete('/api/v1/reflections/:id', [testMiddleware, testMiddleware]);

app.get('/api/v1/users', [authMiddleware, UserController.getAll]);
app.get('/api/v1/users/:id', UserController.getById);
app.post('/api/v1/users', UserController.create);

app.post('/api/auth', AuthenticationController.authenticate);
app.get('/api/auth', AuthenticationController.test);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
