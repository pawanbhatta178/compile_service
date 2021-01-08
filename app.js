require('dotenv').config()
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const compile = require('./compile');
const PORT = process.env.PORT || 2000;


app.use(express.json());


(async () => {
    app.post("/", compile)
    app.listen(PORT, ()=>console.log(`Listening at port ${PORT}`))
})();