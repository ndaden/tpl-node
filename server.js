import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';

import UploadService from './src/service/UploadService';

import ReflectionController from './src/controllers/ReflectionController';
import UserController from './src/controllers/UserController';
import AuthenticationController from './src/controllers/AuthenticationController';
import UploadController from './src/controllers/UploadController';

import testMiddleware from './src/middleware/test.middleware';
import authMiddleware from './src/middleware/auth.middleware';
import uploadMiddleware from './src/middleware/upload.middleware';



const app = express();
const port = process.env.PORT || 3000;
const mongoUser = process.env.MONGOUSER || '';
const mongoPwd = process.env.MONGOPWD || '';
const mongoUri = process.env.MONGOURI || 'localhost';
const mongoDbName = process.env.MONGODBNAME || 'users';
const frontAppUri = process.env.FRONTAPPURI || 'http://localhost:8080';
let uri = '';

if (mongoUser && mongoPwd)
{
    uri = `mongodb+srv://${mongoUser}:${mongoPwd}@${mongoUri}/${mongoDbName}?retryWrites=true&w=majority`;
} else {
    uri = `mongodb://${mongoUri}/${mongoDbName}`;
}

mongoose.connect(uri, {useNewUrlParser: true })
        .then(() => console.log('Connected to MongoDB !'))
        .catch(error => console.log(error));

mongoose.set('useCreateIndex', true);

const corsOptions = {
    origin: frontAppUri,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

const uploadManager = UploadService.init();

app.get('/', (req, res) => {
    return res.status(200).send({ 'message': 'Welcome to the backend! version : 03/01/2020' });
});

app.post('/api/v1/reflections', [testMiddleware, ReflectionController.create]);
app.get('/api/v1/reflections', [testMiddleware, ReflectionController.getAll]);
app.get('/api/v1/reflections/:id', [testMiddleware, ReflectionController.getOne]);
app.delete('/api/v1/reflections/:id', [testMiddleware, testMiddleware]);

app.get('/api/v1/users', [authMiddleware, UserController.getAll]);
app.get('/api/v1/users/:id', UserController.getById);
app.post('/api/v1/users', UserController.create);
app.post('/api/v1/users/activate', UserController.activate );

app.post('/api/v1/upload',[authMiddleware, uploadManager.single('avatar'), uploadMiddleware]);
app.get('/api/v1/file/:id', authMiddleware, UploadController.get);

app.post('/api/auth', AuthenticationController.authenticate);
app.get('/api/auth', AuthenticationController.test);

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});
