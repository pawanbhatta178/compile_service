require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');
const compile = require('./compile');
const PORT = process.env.PORT || 2000;

app.use(cors());
app.use(bodyParser.json());

(async () => {
    app.post("/compile", compile)
    app.listen(PORT, ()=>console.log(`Listening at port ${PORT}`))
})();