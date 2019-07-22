import User from '../models/User';
import {hashSync, compareSync} from 'bcrypt';
const saltRounds = 10;

const UserController = {
    create(req, res) {
        let newUser = new User(req.body);
        newUser.password = hashSync(req.body.password, saltRounds);
        newUser.save()
        .then(result => res.send(result), error => res.status(500).send(error));
    },
    getAll(req, res) {
        try {
            User.find().exec().then(result => res.send(result));
        } catch(error) {
            res.status(500).send(error);
        }
    },
    getById(req, res) {
        User.findById(req.params.id).exec()
        .then(result => res.send(result),
            error => res.status(500).send(error));
    },
    getByCriterias(req, res){
        User.find({username: req.body.username}).exec()
        .then(result => {
            if(result.length > 0 && compareSync(req.body.password, result[0].password))
            {
                res.send(result);
            } else 
            {
                res.status(404).send([]);
            }
        }, error => res.status(500).send(error));
    }
};

export default UserController;