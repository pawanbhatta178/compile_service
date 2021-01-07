const fsPromises = require('fs').promises 

const { TASKS_PATH } = process.env;

const deleteFolder = async({folderName}) => {
   await fsPromises.rmdir(`${TASKS_PATH}/${folderName}`, {recursive:true})
}

module.exports = deleteFolder;