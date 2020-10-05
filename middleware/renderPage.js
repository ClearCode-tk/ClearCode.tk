const ejsData = require("../routes/ejs");

module.exports = function RenderPage(res, file, data = { user: {} }) {
	res.render(file, { ...ejsData, ...data });
};