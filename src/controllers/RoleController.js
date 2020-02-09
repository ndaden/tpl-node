import RoleService from '../service/RoleService';

const RoleController = {
    create(req, res) {
        if(req.body.code && req.body.name){
            RoleService.create(req.body.code, req.body.name).then(() => {
                res.status(200).send({ success: true });
            }).catch(() => {
                res.status(500).send({ success: false });
            });
        }
    },
    addRoleToUser(req, res) {
        if(req.body.username && req.body.code){
            RoleService.assignRoleToUser(req.body.username, req.body.code);
            res.send({ success: true });
        }
    },
    removeRoleToUser(req, res) {
        if(req.body.username && req.body.code){
            RoleService.unassignRoleToUser(req.body.username, req.body.code);
            res.send({ success: true });
        }
    }
}

export default RoleController;