import request from 'request';

import * as config from '../service/config';

const UploadController = {
    get(req, res) {
        const filename = req.params.id;
        const filePath = config.AWS_BASE_URL + 'userAvatar/' + filename;

        request(filePath).pipe(res);
    }
};

export default UploadController;