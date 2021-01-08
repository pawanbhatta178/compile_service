const {db} =require("./db");

class tests{//schema must match table name in database
    constructor({ id, challenge_id, args, expected_output, arg_size, arg_type, return_type }) {
    this.id=id;
    this.challenge_id = challenge_id;
    this.args = args;
    this.expected_output = expected_output;
        this.arg_size = arg_size;
        this.arg_type = arg_type;
        this.return_type = return_type;
}
}

const Test=({ id, challenge_id, args, expected_output, arg_size, arg_type, return_type })=>{
    const test = new tests({ id, challenge_id, args, expected_output, arg_size, arg_type, return_type });
    
    return {
        ...db( test ),
    }
    
}

module.exports = { Test };