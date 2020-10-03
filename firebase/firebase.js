//import firebaee
//add more files as needed
const admin = require("firebase-admin");
const {
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

module.exports = {
  db,
  users,
  dbURL
};