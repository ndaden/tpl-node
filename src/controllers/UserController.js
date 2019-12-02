import User from '../models/User';
import ActivationCode from '../models/ActivationCode';
import { SendToken } from '../service/EmailService';
import {hashSync, compareSync} from 'bcryptjs';
import mongoose from 'mongoose';
import moment from 'moment';
const saltRounds = 10;

const UserController = {
    create(req, res) {
        //1. creation du code d'activation
        const code = generateActivationCode(6);
        const activationCodeId = new mongoose.Types.ObjectId();

        //2. creation du user
        let newUser = new User(req.body);
        newUser.isActive = false;
        newUser.activationCode = activationCodeId;
        newUser.password = hashSync(req.body.password, saltRounds);
        newUser.save()
        .then(
            created => {
                let newActivationCode = new ActivationCode({
                    _id: activationCodeId,
                    validationCode: code,
                    validationCodeSendDate: moment(),
                    validationCodeExpirationDate: moment().add(30, 'minute')
                });
                newActivationCode.save();

                let result = {
                    success: true,
                    user : {
                        username : created.username, email: created.email
                    }, message : "Félicitations ! votre compte a été créé avec succés. Un code d'activation vous a été envoyé sur : " + created.email
                };

                //3. envoi de l'e-mail avec le code d'activation
                SendToken(created.email, code)
                    .then(() => { 
                        res.send(result);
                    })
                    .catch((error) => {
                        result.success = false;
                        result.message = "Un problème est survenu lors de l'envoi de votre code d'activation.";
                        console.log(error);
                        res.send(result);
                    });
            }).catch((error) => {
                let returnedError = { success: false, message : "Une erreur technique s'est produite. merci de contacter l'administrateur du site."}
                if(error.name && error.name == "MongoError"){
                    if(error.code == 11000){
                        returnedError.message = "Un compte avec le même e-mail ou nom d'utilisateur existe déjà.";
                    }
                }
                res.status(500).send(returnedError);
            });
    },
    activate(req, res) {
        console.log(req.body);
        const receivedCode = req.body.activationCode;
        const email = req.body.email;

        User.find({email: email}).exec()
        .then((result) => {
            const user = result[0];
            const activationCodeId = user.activationCode;
            if(!user.isActive){
            ActivationCode.findById(activationCodeId).exec().then((code) => {
                if(code.validationCode === receivedCode && moment().isBefore(code.validationCodeExpirationDate)){
                    user.isActive = true;
                    user.activationDate = moment();
                    user.activationCode = null;
                    user.save();
                    code.remove();
                    res.send({
                        success: true,
                        message : "Votre compte a été activé avec succés !"
                    });
                }else{
                    res.send({
                        success: false,
                        message : "Code incorrect ou expiré"
                    });
                }
            })
        }else{
            res.status(500).send({
                success: false,
                message : "Impossible d'effectuer cette action"
            });
        }
        }).catch(error => {
            console.log(error);
            res.status(500).send({ success: false, message : "Impossible d'effectuer cette action"})
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
    },
};

/**
 * Genere un code d'activation aleatoire 
 * @param {*} length : longueur du code d'activation
 */
const generateActivationCode = (length) => {
    let code = ""; 
    const alphaNum = 'ABCDEFGHIJKLMNOPQRSTUVWXY1234567890'
    for(var i=0; i< length; i++){
        code = `${code}${alphaNum.substr(Math.random()*alphaNum.length, 1)}` ;
    }
    return code;
}

export default UserController;