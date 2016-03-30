var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var utils = require('../lib/utils.js');
// Mongo config
var mongoose = require('mongoose');
mongoose.connect('mongodb://prodsa:password@ds025389.mlab.com:25389/acnode');
//////

var Schema = mongoose.Schema;
var addresscacheSchema = {
	address1: String,
	address2: String,
	address3: String,
	city: String,
	state: String,
	zip: String,
	hashcode: String,
	latitude: Number,
	longitude: Number
};
var AddressCache = mongoose.model('AddressCache', addresscacheSchema);

///////






// GETs
router.get('/:hash', function(req, res) {
	// get from database
	AddressCache.find({ hashcode: req.params.hash }, function(err, items) {
		if(err) throw err;
		console.log(items);
	});
	res.json({ hashcode: req.params.hash });
});

router.get('/id/:id', function(req, res) {
	// get from database
	AddressCache.find({ _id: req.params.id }, function(err, item) {
		if(err) throw err;
		console.log(item);
	});
	res.json({ id: req.params.id });
});

router.get('/partialaddress/:addr1/:city/:state/:zip5', function(req, res) {
	// get from database
	AddressCache.find({ address1: req.params.addr1,
						city: req.params.city,
						state: req.params.state,
					    zip: req.params.zip5 }, function(err, items) {
		if(err) throw err;
		console.log(item);

	});
	res.json({ id: req.params.addr1 });
});

router.get('/citystatezip/:city/:state/:zip5', function(req, res) {
	// get from database
	AddressCache.find({ city: req.params.city,
						state: req.params.state,
					    zip: req.params.zip5 }, function(err, items) {

	});
	res.json({ id: req.params.city });
});

router.get('/citystate/:city/:state', function(req, res) {
	// get from database
	AddressCache.find({ city: req.params.city,
						state: req.params.state }, function(err, items) {

	});
	res.json({ id: req.params.city });
});

router.get('/state/:state', function(req, res) {
	// get from database
	AddressCache.find({ state: req.params.state }, function(err, items) {

	});
	res.json({ id: req.params.state });
});

router.get('/zip5/:zip5', function(req, res) {
	// get from database
	AddressCache.find({ zip: req.params.zip5 }, function(err, items) {

	});
	res.json({ id: req.params.zip5 });
});

router.get('/location/:lat/:long/:radius', function(req, res) {
	// get from database
	AddressCache.find({ latitude: req.params.lat,
						longitude: req.params.long,
					    radius: req.params.radius }, function(err, items) {

	});
	res.json({ id: req.params.lat });
});

router.get('/locationzip/:zip5/:radius', function(req, res) {
	// get from database
	AddressCache.find({ zip: req.params.zip5,
					    radius: req.params.radius }, function(err, items) {

	});
	res.json({ id: req.params.zip5 });
});

router.get('/locationcitystate/:city/:state/:radius', function(req, res) {
	// get from database
	AddressCache.find({ state: req.params.zip5,
					    radius: req.params.radius }, function(err, items) {

	});
	res.json({ id: req.params.city });
});

router.get('/nolocation', function(req, res) {
	// get from database
	AddressCache.find({ $or: [ {latitude: {$in: [null] }}, {longitude: {$in: [null] } }]}, function(err, items) {

	});
	res.json({ });
});











// POSTs
// intercept route, json parser middleware runs, then calls next()
router.post('/:addr1/:addr2/:addr3/:city/:state/:zip/:hash/:lat/:long', jsonParser , function(req, res) {
	// save to db
	var hashCode = utils.getAddressHashCode(req.params.addr1,
											req.params.addr2,
											req.params.addr3,
											req.params.city,
											req.params.state,
											req.params.zip);

	var ac = AddressCache({
		address1: req.params.addr1,
		address2: req.params.addr2,
		address3: req.params.addr3,
		city: req.params.city,
		state: req.params.state,
		zip: req.params.zip,
		hashcode: hashCode,
		latitude: req.params.lat,
		longitude: req.params.long
	});

	ac.save(function(err) {
		if(err) throw err;

		console.log('Address Cache added!');
	});
	res.send('Adding ' + req.params.hash);
	console.log(req.params.hash);
});


// PUTs
router.put('/:hash', jsonParser , function(req, res) {
	// save to db
	res.send('Updating ' + req.body.hash);
	console.log(req.params.hash);
});



// DELETEs
router.delete('/:hash', function(req, res) {
	// delete from database
	res.send('Deleting ' + req.body.hash);
	console.log(req.params.hash);
});







module.exports = router;