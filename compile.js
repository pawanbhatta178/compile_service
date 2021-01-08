const { Task, Queue } = require("./queue");
const {Test} = require("./entities/Test");
const { cannotFindError } = require("./constants");
const jsQueue = new Queue({name:"javascriptQueue", topic:"js"});
const fs=require('fs').promises;

const getTestSchemaInFormat = (tests) => {
    return tests.map(test => {
        return {
            id: test.id,
            arguments: test.args,
            expectedOutput: test.expected_output,
            argSize: test.arg_size,
            argType: test.arg_type,
            returnType: test.return_type
        }
    })
}


const compile = async (req, res) => {
    console.log(req.body);
    const { source, lang, questionId } = req.body;
    const tests = await Test({}).findAllWith({ challenge_id: questionId });
    if (tests.length === 0) {
        return res.json(cannotFindError);
    }
    const testSchema = getTestSchemaInFormat(tests);
    const task = new Task({ source, language: lang, testSchema });
    // await fs.writeFile(`./code.js`, source);

    const enqueued=await jsQueue.enqueue(task);
    if (enqueued.error) {
        return res.json({ error:enqueued.error });
    }
    const { error, result } = await jsQueue.dequeue({ taskId: enqueued.id });
    if (error) {
        return res.json({ error });
    }
    console.log(result);
    res.send(result);
}

module.exports = compile;