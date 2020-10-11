const express = require('express'),
  cookieParser = require("cookie-parser"),
  fs = require("fs")
  Path = require("path");

const { BadRequest, NotFound, handleErrors } = require("../../middleware/errorHandling/errors");

const data = JSON.parse(fs.readFileSync("./keys/data.json"));
const APIKEY = process.env.APIKEY;
const router = express.Router();

router.use(express.json());

router.get("/api/v1/available", (req, res, next) => {
  if (!data || !data["Machines"]) next(new NormalError("Could not get data!"));
  res.send(data["Machines"]["Available"]);
});

router.post("/api/v1/available", (req, res, next) => {
  if (!data) data = { Machines: { "Availbale": [], "Unavailable": [] } };
  if (req.headers["cctk-key"] !== APIKEY) return next(new BadRequset("CCTK-Key not present or key doesn't match. Retry again later."));

  const { available, machineName, url } = req.body;
  if (!machineName) return next(new BadRequest("No machine name given. Please retry with a name!"));
  if (!url) return next(new BadRequest("No url given. Please retry with a url!"));

  const machineInfo = { machineName, url };
  const availMachines = data["Machines"]["Available"];
  const unavailMachines = data["Machines"]["Unavailable"];

  if (available == true) {
    if (unavailMachines.hasOwnProperty(machineName)) delete unavailMachines[machineName];

    availMachines[machineName] = {
      machineName,
      url
    }
  } else if (available == false) {
    if (availMachines.hasOwnProperty(machineName)) delete availMachines[machineName];
    
    unavailMachines[machineName] = {
      machineName,
      url
    }
  }

  fs.writeFile("./keys/data.json", JSON.stringify(data || {}, null, 2), (err) => {
    if (err) throw err;
  });

  return res.send(data["Machines"]);
});

function apiRoutes() {return router};
module.exports = apiRoutes;