var dateFormat = require('dateformat');
var middleware = {
	requireAuthentication: function (req, res, next) {
		console.log('Private Route Hit!');
		next();  //if user logged in, call next
	},
	logger: function(req, res, next) {
		console.log('Request(' + dateFormat(new Date()) + '): ' + req.method + ' ' + req.originalUrl);
		next();
	}
};

module.exports = middleware;
