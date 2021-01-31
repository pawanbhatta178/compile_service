const { db } = require("./db");

class submissions {
  //schema must match table name in database
  constructor({
    userId,
    questionId,
    lang,
    error,
    testResult,
    timeTaken,
    source,
    wordCount,
  }) {
    this.user_id = userId;
    this.challenge_id = questionId;
    this.language = lang;
    if (error) {
      this.error = error;
    }
    if (testResult) {
      this.test_result = testResult;
    }
    if (timeTaken) {
      this.time_taken = timeTaken;
    }
    if (source) {
      this.code = source;
    }
    if (wordCount) {
      this.word_count = wordCount;
    }
  }
}

const Submissions = ({
  userId,
  questionId,
  lang,
  error,
  testResult,
  timeTaken,
  source,
  wordCount,
}) => {
  const submission = new submissions({
    userId,
    questionId,
    lang,
    error,
    testResult,
    timeTaken,
    source,
    wordCount,
  });

  return {
    ...db(submission),
  };
};

// Submissions({
//   userId: "45545af7-0726-4184-9eca-a750a75ce7d9",
//   questionId: "1",
//   lang: "js",
//   error: "asas",
//   testResult: "asas",
//   timeTaken: "12",
//   source: "fsd",
//   wordCount: "1000",
// })
//   .save()
//   .then((res) => console.log(res));

module.exports = { Submissions };
