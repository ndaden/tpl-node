import User from '../models/User';
import {hashSync, compareSync} from 'bcryptjs';
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
    getUserById(id, cb) {
        console.log("getting user by id");
        User.findById(id).exec()
        .then(result => {
            let user = result[0];
            user.password = undefined;
            return cb(null, user);
        },
        error => cb(error, null));
    },
    authenticateUser(username, password, cb){
        User.find({username: username}).exec()
        .then(result => {
            if(result.length > 0 && compareSync(password, result[0].password))
            {
                let user = result[0];
                user.password = undefined;
                return cb(null, user);
            } else 
            {
                return cb("invalid username or password", null);
            }
        }, error => cb("unknown error", null));
    }
};

export default UserController;