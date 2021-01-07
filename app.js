require('dotenv').config()
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 2000;
(async () => {
    app.post("/", (req, res) => {
        res.send("HELLo")
    })
    app.listen(PORT, ()=>console.log(`Listening at port ${PORT}`))
})();