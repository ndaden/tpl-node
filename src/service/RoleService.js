import Role from '../models/Role';
import User from '../models/User';

const RoleService = {
    create(code, name) {
        const role = new Role({ roleCode: code, roleName: name});
        return role.save();
    },
    delete(code) {
        return Role.deleteOne({ roleCode: code });
    },
    assignRoleToUser(username, roleCode) {
        Role.findOne({ roleCode: roleCode}).exec((error, role) => {
            User.findOne({ username: username }).exec((error, user) => {
                user.roles = [...user.roles, role.id];
                return user.save();
            });
        });     
    },
    unassignRoleToUser(username, roleCode) {
        const r = [];
        r.splice(r.indexOf(r.id), 1)
        Role.findOne({ roleCode: roleCode}).exec((error, role) => {
            console.log('role id:', role.id);
            User.findOne({ username: username }).exec((error, user) => {
                user.roles.splice(user.roles.indexOf(role.id), 1);
                console.log('roles: ', user.roles[0]);
                return user.save();
            });
        });  
    }
};

export default RoleService;