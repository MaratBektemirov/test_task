const fs = require('fs').promises;

async function txtFileListToArray(filePath) {
    const buf = await fs.readFile(filePath);

    return buf
        .toString()
        .split('\n')
        .filter((v) => v);
}

function log(text) {
    process.stdout.cursorTo(0);
    process.stdout.clearLine();
    process.stdout.write(text);
}

function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    })
}

function progress(count, total) {
    return (count / total * 100).toFixed(0) + '%';
}

module.exports = {
    txtFileListToArray,
    log,
    delay,
    progress,
};