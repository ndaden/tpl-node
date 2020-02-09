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
    avatarUrl: {
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
    activationCode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'activationCode'
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role'
    }]
});

const User = mongoose.model("user", UserSchema);

export default User;