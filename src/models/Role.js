import mongoose, {Schema} from 'mongoose';

const RoleSchema = new Schema({
    roleCode : {
        type: String,
        uppercase: true,
        unique: true,
        required: 'Role code is required',
        trim: true
    },
    roleName : {
        type: String,
        required: 'Role name is required',
        trim: true
    }
});

const Role = mongoose.model("role", RoleSchema);

export default Role;