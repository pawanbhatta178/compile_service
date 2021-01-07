const fs = require('fs');
const { promisify } = require("util");
const writeFile = promisify(fs.writeFile);
const { nothingToWriteError}=require("./constants");
const { TASKS_PATH } = process.env;

const makeDir = (dirName) => {
    if (!fs.existsSync(`./${TASKS_PATH}/${dirName}`)) {
        fs.mkdirSync(`./${TASKS_PATH}/${dirName}`);
    }
}

const writeToFile = async({ data, fileName, folderName }) => {
    let writableData;
    if (!data) {
        writableData = JSON.stringify(nothingToWriteError)
    }
    else {
        writableData = JSON.stringify(data);
    }
    try {
       makeDir(folderName);
       await writeFile(`${TASKS_PATH}/${folderName}/${fileName}`,writableData)
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = writeToFile;