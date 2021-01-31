const { db } = require("./db");

class successful_submissions {
  //schema must match table name in database
  constructor({ subId, challengeId, userId }) {
    this.user_id = userId;
    this.challenge_id = challengeId;
    this.submission_id = subId;
  }
}

const SuccessfulSubmission = ({ subId, challengeId, userId }) => {
  const successful_submission = new successful_submissions({
    subId,
    challengeId,
    userId,
  });

  return {
    ...db(successful_submission),
  };
};

// SuccessfulSubmission({
//   userId: "6cc0aeb9-42d3-4388-8036-f86a19fb25e8",
//   subId: "4",
//   challengeId: "1",
// })
//   .save()
//   .then((res) => console.log(res));

module.exports = { SuccessfulSubmission };
