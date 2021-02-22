require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { authenticateToken } = require("./middlewares/authenticateToken");

const jwt = require("jsonwebtoken");
const compile = require("./compile");
const PORT = process.env.PORT || 9999;

app.use(cors());
app.use(bodyParser.json());

(async () => {
  app.post("/compile", authenticateToken, compile);
  app.listen(PORT, () => console.log(`Listening at port ${PORT}`));
})();
