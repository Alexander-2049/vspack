#!/usr/bin/env node
import projectdir from '../lib/projectdir.js';
import zip from "zip-lib";
import createTmpDir from "../lib/createTmpDir.js";
import ncp from "ncp";
import fs from "fs";
import getFolderSize from 'get-folder-size';

const a1 = performance.now();
const size = await getFolderSize.loose(projectdir);
const a2 = performance.now();
console.log(`Start size: ${(size / 1024 / 1024).toFixed(2)}MB`);
console.log(`Measured in ${a2 - a1}ms`);

if(size / 1024 / 1024 > 1024) {
    console.log("Folder size can't be bigger than 1GB");
    throw new Error(`Chosen folder size: ${(size / 1024 / 1024 / 1024).toFixed(2)}GB`);
}

const tmpdir = createTmpDir();
const p1 = performance.now();

ncp(projectdir, tmpdir, {
    clobber: false,
    filter: function (f) {
        return !f.endsWith(".exe")
            && !f.endsWith(".sdf")
            && !f.includes("Debug")
            && !f.endsWith("\\.vs");
    },
}, () => {
    const outputName = "build.zip";
    zip.archiveFolder(tmpdir, process.cwd() + "\\" + outputName).then(function () {
        fs.rmSync(tmpdir, { recursive: true, force: true });
        const p2 = performance.now();
        const time = p2 - p1;
        console.log("Archived in " + time + "ms");

        var stats = fs.statSync(outputName);
        var fileSizeInBytes = stats.size;
        // Convert the file size to megabytes (optional)
        var fileSizeInMegabytes = fileSizeInBytes / (1024*1024);
        console.log(`zip size: ${fileSizeInMegabytes.toFixed(2)}MB`);
    }, function (err) {
        console.log(err);
    });
});

process.on('uncaughtException', err => {
    console.log(`Error: ${err.message}`)
    process.exit(1)
})