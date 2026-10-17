import multer from "multer";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { v4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
    storage: multer.diskStorage({ 
        destination: resolve(__dirname, "..", "..", "uploads"),
        filename: (request, file, callback) => {
            return callback(null, v4() + "-" + file.originalname);
        },
    }),
}; 