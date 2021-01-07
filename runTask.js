require('dotenv').config()
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const readFromFile = require("./readFromFile");
const {TASKS_FOLDER_NAME, TEST_RESULT_NAME} = process.env;

const runTask = async ({ taskId }) => {
   await exec(`docker run --rm -v "$(pwd)"/${TASKS_FOLDER_NAME}/${taskId}:/usr/src/app/task jscompiler:1.0 `);
return await readFromFile({ filePath: `./${TASKS_FOLDER_NAME}/${taskId}`, fileName: `${TEST_RESULT_NAME}` });
}
 
module.exports = runTask;