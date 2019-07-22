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
    }
});

const User = mongoose.model("user", UserSchema);

export default User;