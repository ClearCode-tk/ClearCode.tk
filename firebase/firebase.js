//import firebaee
//add more files as needed
const admin = require("firebase-admin");
const {
  COOKIESECRET,

  type,
  project_id,
  private_key_id,
  private_key,
  client_email,
  client_id,
  auth_uri,
  token_uri,
  auth_provider_x509_cert_url,
  client_x509_cert_url,
  dbURL
} = process.env; // export keys from environment variables
// If you ever need to convert json into .env I have a program for that

const credentials = {
  type,
  project_id,
  private_key_id,
  private_key,
  client_email,
  client_id,
  auth_uri,
  token_uri,
  auth_provider_x509_cert_url,
  client_x509_cert_url
};

// Documentation at *https://googleapis.dev/nodejs/firestore/latest/* //
admin.initializeApp({
  credential: admin.credential.cert(credentials),
  databaseURL: dbURL
});

const db = admin.firestore(); // initialize db with cloud firestore
const users = db.collection("users"); // create users collection
const emails = db.collection("emails");
const projects = db.collection("projects");

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

async function createProject(clodeName, language, traits) {
  // TODO
  // console.log(clodeName, language, traits);
  const { fulluser, username, email, uid } = traits;

  const projectList = projects.doc(fulluser);
  const list = await projectList.get();
  let userProjects = list.data();

  const project = (typeof userProjects == "object") ? userProjects[clodeName] : null;

  if (project) return {
    success: false,
    msg: "Project already exists"
  }
  if (!userProjects) userProjects = {};

  const pid = genID(5);

  const data = {
    pid,
    name: clodeName,
    language,
    uid,
    fulluser,
    username
  };

  userProjects[clodeName] = data;

  await projectList.set(userProjects);

  // console.log(data);
  return {
    success: true,
    data
  }
}

async function getProject(username, clodeName) {
  const projectList = projects.doc(username);
  const list = await projectList.get();
  const userProjects = list.data();
  const project = (userProjects)
  ? userProjects[clodeName]
  : null;
  
  if (!project) return;

  return project;
}

async function getUser(username) {
  const user = users.doc(username);
  const userInfo = await user.get();
  const userExists = userInfo.exists;

  if (!userExists) return;

  return userInfo.data();
}

module.exports = {
  db,
  users,
  emails,
  projects,
  functions: {
    createProject,
    getProject,
    getUser,
    genID
  },
  dbURL
};