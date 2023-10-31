import os from "os";
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

export default function createTmpDir() {
    const dir = os.tmpdir() + "\\.vsc\\" + uuidv4();

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    
    return dir;
}