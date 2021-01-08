const Pool = require('pg').Pool;
const {dbConfig}=require('./keys');

const pool = new Pool({
    user: dbConfig.username,
    host: dbConfig.host,
    database:  dbConfig.database,
    password: dbConfig.password,
    port:dbConfig.port,
    max:20,
    connectionTimeoutMillis:0 ,
    idleTimeoutMillis:0
  })

module.exports=pool;
