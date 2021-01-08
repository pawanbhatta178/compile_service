require('dotenv').config()

const { v4: uuidv4 } = require('uuid');
const { pushError, noItemToDequeueError, success } = require('./constants');
const deleteFolder = require('./deleteFolder');
const writeToFile = require('./writeToFile');
const { SOURCE_NAME, TEST_SCHEMA_NAME} = process.env;
const runTask = require("./runTask");

class Task {
    constructor({source, testSchema, language}) {
        this.id = uuidv4();
        this.source = source;
        this.testSchema = testSchema;
        this.language = language;
    }
    toJSON() {
        return {
            id: this.id,
            source: this.source,
            language: this.language,
            testSchema:this.testSchema
        }
    }
}

class Queue {
    tasks = [];
    constructor({ name, topic }) {
        this.id = uuidv4();
        this.topic = topic;
        this.name = name;
    }

    isEmpty() {
        return this.tasks.length === 0;
    }

    size() {
        return this.tasks.length;
    }

    getNextTask() {
        return this.tasks[0];
    }

    async enqueue(task) {
        if (task.language !== this.topic) {
            return pushError; //cannot enqueue unless the queue supports task's language 
        }
        this.tasks.push(task);
        const promise1= writeToFile({ data: task.source, folderName: task.id,fileName: SOURCE_NAME });
        const promise2 = writeToFile({ data: task.testSchema, folderName: task.id, fileName: TEST_SCHEMA_NAME });
        await Promise.all([promise1, promise2]);
        return { id:task.id };
    }

    async dequeue({taskId}) {
        if (this.isEmpty()) {
            return noItemToDequeueError;
        }
        const result=await runTask({taskId});
        await deleteFolder({ folderName: taskId });
        const [taskDequeued] = this.tasks.filter(task => task.id === taskId);
        this.tasks = this.tasks.filter(task=>task.id!==taskId);
        // this.emit(`${taskDequeued.id}`,result);
        return { taskDequeued, result };
    }

    static async delete({ taskId }) {
            await deleteFolder({ folderName: taskId })
     
    }
}


module.exports = { Task, Queue }
//tests
// const queue = new Queue({ name: "javascriptQueue", topic: "js" });
// const task = new Task({ source: "console.log(9)", language: 'jsk', testSchema: "asas" });
// queue.enqueue(task).then(({ error, id }) => {
//     if (error) {
//         console.log({ error });
//         return
//     }
//     queue.dequeue({ taskId: id }).then(res=>console.log(res));
// });
