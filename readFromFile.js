const fsPromises = require('fs').promises 

const readFromFile = async ({ filePath, fileName }) => {
    try {
        return await fsPromises.readFile(`${filePath}/${fileName}`, 'utf8');
    }
    catch (err) {
        return {error:"No data to read because file does not exists."}
    }
}

module.exports = readFromFile;