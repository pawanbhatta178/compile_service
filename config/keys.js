module.exports={
    dbConfig:{
        database:"users",
        username:"postgres",
        password:"postgres",
        host:"localhost",
        dialect:"postgres",
        port:5432,
    },
    redisKeys: {
        usernamesKey: "usernames",
        emailsKey: "emails",
        authsKey:"auths"
    }

}