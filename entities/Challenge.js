const {db} =require("./db");

class challenges{//schema must match table name in database
    constructor({ question_prompt, sample_input, sample_output, difficulty, title }) {
    this.question_prompt=question_prompt;
    this.title = title;
    this.sample_input = sample_input;
    this.sample_output = sample_output;
    this.difficulty = difficulty;
}
}

const Challenge=({question_prompt, sample_input, sample_output, difficulty, title})=>{
    const challenge = new challenges({question_prompt, sample_input, sample_output, difficulty, title});
    
    return {
        ...db( challenge ),
    }
    
}

module.exports = { Challenge };
