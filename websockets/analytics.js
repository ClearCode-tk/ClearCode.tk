const analyticsFile = require('../analytics/analytics');
const fs = require('fs');
const updateFile = require('../middleware/updateFile');

function webSockets(io) {
	io.on('connection', socket => {
		analyticsFile.pageViews++;

    updateFile(fs, './analytics/analytics.json', analyticsFile);
	});
}

module.exports = webSockets;
