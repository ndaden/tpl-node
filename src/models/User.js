import mongoose, {Schema} from 'mongoose';

const UserSchema = new Schema({
    username: {
        type: String,
        required: 'Username is required',
        unique: true
    },
    email: {
        type: String,
        required: 'Email is required',
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    activationDate: {
        type: Date
    },
    validationCode: {
        type: String,
        maxlength: 6,
        trim: true,
    },
    validationCodeSendDate: {
        type: Date
    },
    validationCodeExpirationDate: {
        type: Date
    }
});

const User = mongoose.model("user", UserSchema);

export default User;