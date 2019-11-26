import User from '../models/User';
import { SendToken } from '../service/EmailService';
import {hashSync, compareSync} from 'bcryptjs';
const saltRounds = 10;

const UserController = {
    create(req, res) {
        let newUser = new User(req.body);
        newUser.password = hashSync(req.body.password, saltRounds);
        newUser.save()
        .then(
            created => {
                let result = {
                    success: true,
                    user : {
                        username : created.username, email: created.email
                    }, message : "Félicitations ! votre compte a été créé avec succés."
                };

                SendToken(created.email, "12345").then(() => { console.log('Sent !')});
                
                res.send(result);
            }, 
            error => {
                let returnedError = { success: false, message : "Une erreur technique s'est produite. merci de contacter l'administrateur du site."}
                if(error.name && error.name == "MongoError"){
                    if(error.code == 11000 && error.keyPattern.email){
                        returnedError.message = "Un compte avec le même e-mail existe déjà.";
                    }
                    if(error.code == 11000 && error.keyPattern.username){
                        returnedError.message = "Un compte avec le même nom d'utilisateur existe déjà.";
                    }
                }
                res.status(500).send(returnedError)
            });
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