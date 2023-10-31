import fs from 'fs';

function getProjectPath() {
    const argv = process.argv;
    const cwd = process.cwd();
    if(argv.length === 2) return cwd;
    if(argv[2] === "." && fs.existsSync(argv[2])) {
        return cwd;
    }
    if(argv[2].startsWith(".") && argv[2].length > 1) {
        const path = cwd + argv[2].substring(1).replaceAll("/", "\\");
        return removeBackSlashFromEnd(path);
    }
    if(argv[2].length > 1 && fs.existsSync(argv[2])) {
        return removeBackSlashFromEnd(argv[2]);
    }
    return new Error("Path " + argv[2] + " does not exist");
}

function removeBackSlashFromEnd(path) {
    while(path.slice(-1) === "\\") {
        path = path.substring(0, path.length - 1);
    }
    return path;
}

export default getProjectPath();