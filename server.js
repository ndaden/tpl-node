import express from 'express';
import morgan from 'morgan';
import ReflectionController from './src/controllers/ReflectionController';

const app = express();
const port = 3000;

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    return res.status(200).send({'message': 'Hello world from Express JS blah !'});
});

app.post('/api/v1/reflections', ReflectionController.create);
app.get('/api/v1/reflections', ReflectionController.getAll);
app.get('/api/v1/reflections/:id', ReflectionController.getOne);
app.delete('/api/v1/reflections/:id', ReflectionController.delete);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
