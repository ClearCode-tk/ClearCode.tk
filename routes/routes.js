const { dbURL, db, users } = require("../firebase/firebase"); // Import db
const express = require('express'),
  cookieParser = require("cookie-parser");


const ejsData = require('./ejs');
const { NormalError, BadRequest, NotFound, handleErrors } = require("../middleware/errorHandling/errors");
const { userRoutes, userAuth } = require("./userauth");

function RenderPage(res, file, data = { user: {} }) {
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

  router.get('/404', (_,res) => {
    RenderPage(res, '404.html');
  });

  router.get('/@:username', async (req, res, next) => {
    const { uid } = req.query;
    const username = req.params.username;

    const userSnapshot = await users.where("fulluser", "==", username).get();
    let headersSent = false;

    if (userSnapshot.docs.length < 1) {
      next(new NotFound("Could not find the user you are looking for!"));
      // res.redirect('/404')
    }

    userSnapshot.forEach(userDoc => {
      const userData = userDoc.data();
      if (!userData || !userDoc || headersSent) return;

      if (uid) {
        if (uid == userData.uid) {
          headersSent = true;
          if (req.isAuthenticated()) {
            return RenderPage(res, "profile.html", {
              profile: userData,
              user: { // Request user
                userData: req.userTraits
              }
            });
          }

          return RenderPage(res, "profile.html", {
            profile: userData
          });
        }
        return;
      }

      headersSent = true;
      if (req.isAuthenticated()) {
        return RenderPage(res, "profile.html", {
          profile: userData,
          user: { // Request user
            userData: req.userTraits
          }
        });
      }

      return RenderPage(res, "profile.html", { profile: userData });
    });

  });

  // ERROR Handling keep as the last thing
  router.use(handleErrors);

	return router;
}

module.exports = {
	mainPages,
  userRoutes,
  userAuth,
  RenderPage
};