import express from 'express';
import morgan from 'morgan';
import passport from 'passport';
import bodyParser from 'body-parser';
import { Strategy as LocalStrategy } from 'passport-local';

import ReflectionController from './src/controllers/ReflectionController';

const app = express();
const port = 3000;
const user1 = {username: "nabil", password: "pass"};

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    (username, password, done) => {
        console.log(`received : ${username} - ${password}`);
        if(username === user1.username && password === user1.password){
            return done(null, user1);
        }

        return done(null,false, { message: "Incorrect login and/or password" });
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    setTimeout(done(null, user), 1000);
});

app.post('/login',
    passport.authenticate('local'),
    (req, res) => {
        console.log(req.user);
        res.redirect('http://www.google.com/');
    });

app.get('/', (req, res) => {
    return res.status(200).send({ 'message': 'Hello world from Express JS blah !' });
});

app.post('/api/v1/reflections', ReflectionController.create);
app.get('/api/v1/reflections', ReflectionController.getAll);
app.get('/api/v1/reflections/:id', ReflectionController.getOne);
app.delete('/api/v1/reflections/:id', ReflectionController.delete);



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
