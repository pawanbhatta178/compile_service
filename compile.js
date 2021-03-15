const { Task, Queue } = require("./queue");
const { Test } = require("./entities/Test");
const { cannotFindError } = require("./constants");
const jsQueue = new Queue({ name: "javascriptQueue", topic: "js" });
const { Submissions } = require("./entities/Submissions");
const { SuccessfulSubmission } = require("./entities/SuccessfulSubmissions");

const randomNum = (max, min, option) => {
  if (!option) {
    return Math.random() * (max - min + 1) + min;
  }
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const randomTime = () => {
  return randomNum(0.1, 7.9);
};

const randomWordCount = () => {
  return randomNum(1, 1000, { option: "rounded" });
};

const getTestSchemaInFormat = (tests) => {
  return tests.map((test) => {
    return {
      id: test.id,
      arguments: test.args,
      expectedOutput: test.expected_output,
      argSize: test.arg_size,
      argType: test.arg_type,
      returnType: test.return_type,
      hidden: test.hidden,
    };
  });
};

const compile = async (req, res) => {
  console.log(req.body);
  console.log(req.user);
  const { id: userId } = req.user;
  const { source, lang, questionId } = req.body;
  const tests = await Test({}).findAllWith({ challenge_id: questionId });
  if (tests.length === 0) {
    return res.json(cannotFindError);
  }

  const testSchema = getTestSchemaInFormat(tests);
  const task = new Task({ source, language: lang, testSchema });
  // await fs.writeFile(`./code.js`, source);
  const enqueued = await jsQueue.enqueue(task);
  if (enqueued.error) {
    return res.json({ error: enqueued.error });
  }
  const { error, result } = await jsQueue.dequeue({ taskId: enqueued.id });
  console.log(result);

  if (error) {
    return res.json({ error });
  }
  const object = JSON.parse(result);
  const detailedObject = {
    ...object,
    userId,
    lang,
    questionId,
    timeTaken: randomTime(),
    wordCount: randomWordCount(),
  };

  if (detailedObject?.testResult) {
    //chance that the submission passes all tests
    const passedAllTests = detailedObject.testResult.reduce(
      (acc, test) => acc && test.passed,
      true
    );
    let submittedData;
    if (passedAllTests === true) {
      submittedData = await Submissions({
        ...detailedObject,
        testResult: JSON.stringify(detailedObject.testResult),
        source,
      }).save();
      detailedObject["submittedAt"] = submittedData[0]?.submitted_at;
      detailedObject["submissionId"] = submittedData[0]?.id;
      detailedObject["code"] = submittedData[0]?.code;
      detailedObject["passedAllTests"] = true;
      if (submittedData.length === 1) {
        const previousRank = await SuccessfulSubmission({}).findAllWith({
          user_id: userId,
          challenge_id: questionId,
        });
        if (previousRank.length === 1) {
          //was already ranked
          const [previousSubmission] = await Submissions({}).findAllWith({
            id: previousRank[0].submission_id,
          });
          if (
            submittedData[0].time_taken < previousSubmission.time_taken &&
            submittedData[0].word_count < previousSubmission.word_count
          ) {
            const updatedSubmission = await SuccessfulSubmission(
              {}
            ).updateOneWith(
              { user_id: userId, challenge_id: questionId },
              { submission_id: submittedData[0].id }
            );
            if (updatedSubmission.length === 1) {
              detailedObject["ranked"] = true;
            }
          }
        } else {
          //wasnt ranked
          const ranked = await SuccessfulSubmission({
            subId: submittedData[0].id,
            challengeId: questionId,
            userId,
          }).save();
          if (ranked.length === 1) {
            detailedObject["ranked"] = true;
          }
        }
      }
    } else {
      submittedData = await Submissions({
        ...detailedObject,
        testResult: JSON.stringify(detailedObject.testResult),
      }).save();
      detailedObject["submittedAt"] = submittedData[0]?.submitted_at;
      detailedObject["submissionId"] = submittedData[0]?.id;
      detailedObject["passedAllTests"] = false;
    }
  }
  console.log(detailedObject);
  res.send(detailedObject);
};

module.exports = compile;
