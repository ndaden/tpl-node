import { createWorker } from 'tesseract.js';
import UploadService from '../service/UploadService';

const OcrController = {
    async doOcr(req, res) {
        const worker = req.worker;
        if (worker) {
            await UploadService.optimizeImage(req.file.path, 500, 90);

            const { data: { text } } = await worker.recognize(req.file.path);

            const lignes = text.split('\n');
            res.status(200).send({ result: lignes, path: req.file.path });
        }else{
            res.status(500).send({ success: false });
        }
    },
};

export default OcrController;