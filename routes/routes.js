const express = require('express');
const ejsData = require('./ejs');

function RenderPage(res, file) {
	res.render(file, ejsData);
}

function mainPages() {
	const router = express.Router();

	router.get('/', (_, res) => {
		RenderPage(res, 'index.html');
	});

	return router;
}

module.exports = {
	mainPages
};
