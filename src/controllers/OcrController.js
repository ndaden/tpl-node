import { createWorker } from 'tesseract.js';
import UploadService from '../service/UploadService';

const OcrController = {
    async doOcr(req, res) {
        // OCR INIT
        const worker = createWorker({
            logger: m => console.log(m),
        });

        await worker.load();
        await worker.loadLanguage('fra');
        await worker.initialize('fra');

        await UploadService.optimizeImage(req.file.path, 500, 90);

        const { data: { text } } = await worker.recognize(req.file.path);

        const lignes = text.split('\n');
        res.status(200).send({ result : lignes, path: req.file.path });
    },
};

export default OcrController;