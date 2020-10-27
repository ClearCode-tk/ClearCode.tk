const express = require('express'),
  cookieParser = require("cookie-parser"),
  fs = require("fs")
  Path = require("path");

const { BadRequest, NotFound, handleErrors } = require("../../middleware/errorHandling/errors");

const data = JSON.parse(fs.readFileSync("./keys/data.json"));
const APIKEY = process.env.APIKEY;
const router = express.Router();

router.use(express.json());

// API

function apiRoutes() {return router};
module.exports = apiRoutes;