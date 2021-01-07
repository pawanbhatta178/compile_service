require('dotenv').config()
const EventEmitter = require('events');

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

class Queue extends EventEmitter{
    tasks = [];
    constructor({ name, topic }) {
        super();
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

    async dequeue() {
        if (this.isEmpty()) {
            return noItemToDequeueError;
        }
        const nextTask=this.getNextTask();
        const result=await runTask({taskId:nextTask.id});
        await deleteFolder({ folderName: nextTask.id });
        const taskDequeued = this.tasks.shift();
        this.once(`${taskDequeued.id}`,[result]);
        return { taskDequeued, result };
    }

    static async delete({taskId}) {
       await deleteFolder({folderName:taskId})
    }
}

const queue = new Queue({ name: "javascriptQueue", topic: "js" });
const task = new Task({ source: "console.log(9)", language: 'js', testSchema: "asas" });
const { error, id }=queue.enqueue(task);

queue.on(`${task.id}`, (res)=>console.log(res))

