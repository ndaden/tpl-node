import ReflectionModel from '../models/Reflection';

const ReflectionController = {
    create(req, res){
        if(!req.body.success && !req.body.lowPoint && !req.body.takeAway){
            return res.status(400).send({'message': 'All fields are required'});
        }

        const reflection = ReflectionModel.create(req.body);
        return res.status(201).send(reflection);
    },

    getAll(req, res){
        const reflections = ReflectionModel.findAll();
        return res.status(200).send(reflections);
    },

    getOne(req, res){
        console.log(req.params);
        const reflection = ReflectionModel.findOne(parseInt(req.params.id));

        if(!reflection){
            return res.status(404).send({'message' : 'Reflection not found'});
        }

        return res.status(200).send(reflection);
    },

    delete(req, res){
        const reflection = ReflectionModel.findOne(req.params.id);
        if(!reflection) {
            return res.status(400).send({'message': 'reflection not found'});
        }

        const ref = ReflectionModel.delete(req.params.id);
        return res.status(204).send(ref);
    }
};

export default ReflectionController;