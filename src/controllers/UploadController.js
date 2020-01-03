import path from 'path';
import fs from 'fs';

const UploadController = {
    get(req, res) {
        const filename = req.params.id;
        const filePath = path.resolve(__dirname, '../../dist/uploads/', filename)
        if (fs.existsSync(filePath)) {
            return res.sendFile(filePath);
        }

        return res.sendFile(path.resolve(__dirname, '../../dist/uploads/default.jpg'));
    }
};

export default UploadController;