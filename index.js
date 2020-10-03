const express = require('express'),
	app = express(),
	ejs = require('ejs'),
	server = require('http').createServer(app),
	io = require('socket.io')(server);

const Path = require('path');

const { mainPages } = require('./routes/routes');
const ejsData = require('./routes/ejs');

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', Path.join('./src/views'));

app.use(express.json());
app.use("/", express.static(Path.join(__dirname, './src/public')));
app.use(mainPages()); // Main routings for home, login, signup, etc.

server.listen(3000, _ => console.log('Listening on port 3000'));
