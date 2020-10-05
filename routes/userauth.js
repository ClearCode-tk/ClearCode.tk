const { dbURL, db, users, emails } = require("../firebase/firebase"); // Import db
const ejsData = require('./ejs');

const express = require('express'),
  cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");

function genID(len) {
  const arr = new Array(len);
  arr.fill(undefined);
  const newarr = arr.map(() => {
    const random = (Math.random() * 16).toFixed(4).toString(36).replace(".", "");
    const str = random[Math.floor(Math.random() * 4)];
    return str;
  });

  return newarr.join("");
}

function checkLoggedIn(options = { key1: "email", key2: "password" }, res) {
  options = Object.assign({ key1: "email", key2: "password" }, options); // Set defaults
  return new Promise(async (resolve, reject) => {
    let { key1, value1, key2, value2 } = options;

    if (res && res.body) {
      const { email, password } = res.body;
      key1 = "email";
      value1 = email;
      key2 = "password";
      value2 = password;
    }

    const querySnapshot = await users.where(key1, "==", value1).get(); // Get the snapshot of the data if the email "==" the value given (in this case an email)
    let redirected = false;

    if (querySnapshot.docs.length < 1) resolve(); // If there isn't any entries inside the db then resolve with nothing

    querySnapshot.forEach(async userDocSnap => { // If it does have some then loop through all entries
      if (userDocSnap && !redirected) { // Check if it is a entry and we haven't redirected yet
        const userData = userDocSnap.data(); // Grab the data from database
        if (!userData) return; // Return if there isn't any data

        const { uid, firstname, lastname, email, password: hashedpass } = userData; // Destructure data
        if (!userData.hasOwnProperty(key1) && !userData.hasOwnProperty(key2)) return; // Check if keys exist on the user data

        if (value1 === userData[key1]) { // If the first value (in this case the email) equals the value of key1 in data (in this case the "email" value in the obj)
          if (key2 === "password" && await bcrypt.compare(value2, userData[key2])) { // if key2 is password then we compare the value2 (in this case the password given (stringified))
            if (res)
              userAuth.registerAccount(res, userData);
            redirected = true; // Set redirected to true to make sure that we don't have to worry about looping through these docs

            resolve(userData); // resolve with the userdata
          } else if (userData[key2] === value2) { // Other special stuff
            if (res)
              userAuth.registerAccount(res, userData);
            redirected = true;

            resolve(userData);
          } else {
            resolve(); // If nothing matches resolve with nothing
          }
        }
      } else {
        resolve();
      }
    });
  });
}

// Probably should be a class IDK though //

/* Any page where you want the user to be logged in pass the middleware userAuth.authenticate() in */
const userAuth = {
  configureDefaults: (options = {}) => Object.assign({ type: "login", redirect: "/", cookies: [{ dataKey: "uid", cookie: "CCUID" }, { dataKey: "password", cookie: "CCP" }] }, options)
};

userAuth.createUser = async (data) => {
  let { firstname, lastname, username, email, password, confpassword, pfp } = data;
  if (password !== confpassword) return { success: false, status: 403, msg: "Passwords do not match!" };
  if (!email) return { success: false, status: 403, msg: "No email given. Please enter email!" };
  if (!firstname || !lastname) return { success: false, status: 403, msg: "No first or last name. Please enter fullname!" };

  const emailDoc = emails.doc(email); // Get email in emails list
  const emailExists = (await emailDoc.get()).exists; // Check if it exists already
  
  if (emailExists) { // If it exists then error out
    return {
      success: false,
      status: 403,
      msg: "Account with specified emails already exists!"
    };
  }

  const uid = genID(15); // Generate a 15 digit uid
  const usernum = genID(4); // Generate a 4 digit tag for the username
  const fulluser = `${username}-${usernum}`;

  const userData = users.doc(fulluser);
  if ((await userData.get()).exists) return userAuth.createUser(data);

  const hashedPass = await bcrypt.hash(password, await bcrypt.genSalt());

  // Response of userdata in database
  const userRes = await userData.set({
    uid,
    fulluser,
    username,
    email,
    firstname,
    lastname,
    password: hashedPass
  });

  // Response of creating an email value in database
  const emailRes = await emailDoc.set({
    fulluser,
    username,
    email,
    firstname,
    lastname,
    uid
  });

  return {
    success: true,
    status: 200,
    msg: "Successfully created account!",
    userData: {
      uid,
      username,
      email,
      firstname,
      lastname,
      fulluser,
      hashedPass,
      password
    }
  };
};

// Old Validator
/*
userAuth.validateLogin = (options) => {
  const { redirect, cookies: [ id, pass ] } = userAuth.configureDefaults(options);
  
  return async (req, res, next) => {
    const CCUID = req.signedCookies[id.cookie];
    const CCP = req.signedCookies[pass.cookie];

    const isLoggedin = await checkLoggedIn({ key1: id.dataKey, value1: CCUID, key2: pass.dataKey, value2: CCP });
    res.isAuthenticated = () => isLoggedin ? true : false; // IF there is login data return true else false

    if (!isLoggedin) return res.redirect(redirect);

    next(isLoggedin ? true : false); // same here
  }
};
*/

// New Validator
userAuth.validateLogin = (options) => {
  const { redirect } = userAuth.configureDefaults(options);

  return async (req, res, next) => {
    const { CCUID, SID } = req.signedCookies;

    if (SID == CCUID) return true;
    else return false;
  }
}

userAuth.ezAuth = (req, res, next) => {
  if (!req.isAuthenticated) {
    req.isAuthenticated = () => {
      if (!req.signedCookies) return;

      const { SID, CCTrait, CCUID } = req.signedCookies;

      if (SID == CCUID && CCTrait) {
        const traitObj = JSON.parse(CCTrait);
        req.userTraits = traitObj;

        return traitObj.uid == SID;
      } else return false;
    }
  }

  next();
}

// Register account via signed cookies
userAuth.registerAccount = (res, data) => {
  const { uid } = data;

  res.cookie("CCUID", uid, { signed: true });
  // res.cookie("CCP", normalPass, { signed: true }); // Probably not secure but I will make it something else
  res.cookie("SID", uid, { signed: true });
  res.cookie("CCTrait", JSON.stringify(data), { signed: true });
}

// Authenticate login to make sure user is logged in
userAuth.authenticate = (options = {}) => {
  const { type } = userAuth.configureDefaults(options);

  if (!type || type == "login") {
    return userAuth.validateLogin(options);
  }
}

module.exports = {
  userRoutes: () => {
    const router = express.Router();
    router.use(express.urlencoded({ extended: false }));
    router.use(cookieParser(process.env.COOKIESECRET)); // For signed cookies

    router.post("/signup", async (req, res) => {
      const { success, userData } = await userAuth.createUser(req.body);

      if (success) {
        return res.redirect("/signin");
      }

      res.redirect("/signup");
    });

    router.post("/signin", async (req, res) => {
      const { email, password } = req.body;
      const userData = await checkLoggedIn({ key1: "email", value1: email, key2: "password", value2: password });

      if (userData) {
        userAuth.registerAccount(res, {
          uid: userData.id,
          email,
          ...userData
        });

        return res.redirect("/");
      }
      
      return res.redirect(req.get('referer'));
    });

    return router;
  },

  userAuth
}