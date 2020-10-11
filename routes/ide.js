const { dbURL, db, users, emails, projects, functions: {
  createProject,
  getProject,
  getUser
}} = require("../firebase/firebase"); // Import db
const ejsData = require('./ejs');

const express = require('express'),
  cookieParser = require("cookie-parser"),
  fs = require("fs")
  Path = require("path");

const { NotFound, handleErrors } = require("../middleware/errorHandling/errors");
const { userRoutes, userAuth } = require("./userauth");
const RenderPage = require("../middleware/renderPage");

let ideConfig = JSON.parse(fs.readFileSync("./keys/ide-config.json"));

function ideRoutes() {
  const router = express.Router();
  router.use(userAuth.ezAuth);

  router.get("/ide/config", (req, res) => {
    fs.readFile("./keys/ide-config.json", "utf8", (err, data) => {
      if (err) throw err;

      res.status(200).send(JSON.parse(data));
    });
  });

  router.get("/@:username/:clodeName", userAuth.authenticate({ redirect: "/" }), async (req, res, next) => {
    if (res.headersSent) return next();
    if (req.isAuthenticated()) {
      const { username, clodeName } = req.params;

      const user = await getUser(username);
      const project = await getProject(username, clodeName);

      // console.log(project);

      if (typeof user !== "object") {
        return next(new NotFound("Could not find the user you were looking for!"));
      }
      if (typeof project !== "object") {
        return next(new NotFound("Could not find the project you were looking for!"));
      }

      return RenderPage(res, "editor.html", {
        user: {
          userData: req.userTraits
        },
        profile: {
          username: username.split("-")[0],
          fulluser: username,
          tag: username.split("-")[1],
          clodeName
        },
        project
      });
    } else {
      return res.redirect(req.get("referer"));
    }
  });

  router.post("/createClode", userAuth.authenticate({ redirect: "/" }), (req, res) => {
    if (req.isAuthenticated()) {
      const { workspacename: clodeName, language } = req.body;
      
      const project = createProject(clodeName, language, req.userTraits);
      const { fulluser } = req.userTraits;

      if (project.success) {
        return res.redirect(`/@${fulluser}/${clodeName}`);
      }

      return res.redirect(req.get("referer"));
    } else {
      return res.redirect(req.get("referer"));
    }
  });

  return router;
}

module.exports = {
  ideRoutes
};