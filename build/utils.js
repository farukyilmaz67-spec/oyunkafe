const fs = require("fs");

function readJSON(file) {

    return JSON.parse(
        fs.readFileSync(file, "utf8")
    );

}

function writeFile(file, content) {

    fs.writeFileSync(
        file,
        content,
        "utf8"
    );

}

function exists(file) {

    return fs.existsSync(file);

}

function makeFolder(folder) {

    if (!fs.existsSync(folder)) {

        fs.mkdirSync(folder, {
            recursive: true
        });

    }

}

function green(text) {

    return `\x1b[32m${text}\x1b[0m`;

}

function yellow(text) {

    return `\x1b[33m${text}\x1b[0m`;

}

function red(text) {

    return `\x1b[31m${text}\x1b[0m`;

}

module.exports = {

    readJSON,
    writeFile,
    exists,
    makeFolder,
    green,
    yellow,
    red

};