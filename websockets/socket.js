function webSockets(io) {
	io.on('connection', socket => {
		console.log('User Joined');
	});
}

module.exports = webSockets;
