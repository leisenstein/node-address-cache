var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;
var middleware = require('./middleware');
var urlEncodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();
var defaultRoutes = require('./routes/index.js');
var addresscacheRoutes = require('./routes/addresscache.js');

console.log('Starting node-address-cache  ......');	
app.use(middleware.logger);
app.use('/', express.static(__dirname + '/public'));






// define routes
app.get('/api', function(req, res) {
		res.json({ version: 1});
});


app.use('/api/addresscache', addresscacheRoutes);


// start listening
app.listen(PORT, function() {
	console.log('Express Server started and listening on Port: ' + PORT);
});