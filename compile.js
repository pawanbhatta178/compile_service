const { Task, Queue } = require("./queue");

const jsQueue = new Queue({name:"javascriptQueue", topic:"js"});

const compile = async (req, res) => {
    console.log(req.body);
    const { source, lang, questionId } = req.body;
    const task=new Task({ source, language: lang, testSchema: questionId });
    const enqueued=await jsQueue.enqueue(task);
    if (enqueued.error) {
        return res.json({ error:enqueued.error });
    }
    // const { error, result } = await jsQueue.dequeue({ taskId: enqueued.id });
    // if (error) {
    //     return res.json({ error });
    // }
    res.send("hello");
}

module.exports = compile;