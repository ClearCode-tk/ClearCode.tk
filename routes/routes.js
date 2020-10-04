const { dbURL, db, users } = require("../firebase/firebase"); // Import db
const express = require('express'),
  cookieParser = require("cookie-parser");


const ejsData = require('./ejs');
const { userRoutes, userAuth } = require("./userauth");

function RenderPage(res, file, data = {}) {
	res.render(file, { ...ejsData, ...data });
}

function mainPages() {
	const router = express.Router();
  router.use(cookieParser(process.env.COOKIESECRET)); // Init Cookie Parser
  router.use(userAuth.ezAuth);

	router.get('/', (req, res) => {
    const data = {
      user: {}
    };

    if (req.isAuthenticated()) {
      data.user.userData = req.userTraits;
    }

		RenderPage(res, 'index.html', data);
	});
	
	router.get('/signup', (_, res) => {
	  RenderPage(res, 'signup.html');
	});
	
	router.get('/signin', (_, res) => {
	  RenderPage(res, 'signin.html');
	});

	return router;
}

module.exports = {
	mainPages,
  userRoutes,
  userAuth
};