const { promisify } = require("util");
const redis = require("redis");
const client = redis.createClient();

client.on('connect', () => {
    console.log('🚀  [Redis] Client connected');
});

client.on("error", (error) => {
    console.error(error);
});

const get = promisify(client.get).bind(client);
const set = promisify(client.set).bind(client);
const getList = promisify(client.lrange).bind(client);
const exists = promisify(client.exists).bind(client);
const rpush = promisify(client.rpush).bind(client);
const lrange = promisify(client.lrange).bind(client);
const sadd = promisify(client.sadd).bind(client);
const sismember = promisify(client.sismember).bind(client);
const scard = promisify(client.scard).bind(client);
const srem = promisify(client.srem).bind(client);
const del = promisify(client.del).bind(client);
const setex=promisify(client.setex).bind(client);
module.exports = {
    get,
    set,
    getList,
    exists,
    rpush,
    lrange,
    sadd,
    sismember,
    scard,
    srem,
    del,
    setex
}
 
