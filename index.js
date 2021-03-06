// Dependencies //
const express = require('express'),
  app = express(),
  ejs = require('ejs'),
  server = require('http').createServer(app),
  io = require('socket.io')(server);

// Modules //
const Path = require('path');

// Main Code //
const { NormalError, handleErrors, handle404 } = require("./middleware/errorHandling/errors");
const { mainPages, userRoutes, userAuth, ideRoutes, apiRoutes } = require('./routes/routes'); // Basic routes

const { dbURL, db, users } = require('./firebase/firebase'); // Import firebase database
const port = 8080;

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', Path.join('./src/views'));

app.use(express.json());
app.use('/', express.static(Path.join(__dirname, './src/public')));
app.use("/node_modules", express.static(Path.join(__dirname, "/node_modules")));
app.use(apiRoutes());
app.use(mainPages()); // Main routings for home, login, signup, etc.
app.use(userRoutes());
app.use(ideRoutes());


app.use(handleErrors);
app.use(handle404);
//socket.io events
require('./websockets/analytics')(io);
require("./websockets/vmapi.js")(io.of("/api"));

server.listen(port, _ => console.log('Listening on port %s', port));

console.clear();