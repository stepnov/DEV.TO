import util from 'util';
import Multer from 'fastify-multer';

const maxSize = 10 * 1024 * 1024;

let processFile = Multer({
    storage: Multer.memoryStorage(),
    limits: {fileSize: maxSize},
}).single('file');

export default util.promisify(processFile);
