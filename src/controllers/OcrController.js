import { createWorker } from 'tesseract.js';

const OcrController = {
    async doOcr(req, res) {
        // OCR INIT
        const worker = createWorker({
            logger: m => console.log(m),
        });

        await worker.load();
        await worker.loadLanguage('fra');
        await worker.initialize('fra');

        const { data: { text } } = await worker.recognize(req.file.path);

        const lignes = text.split('\n');
        res.status(200).send({ result : lignes });
    },
};

export default OcrController;