var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var utils = require('../lib/utils.js');




////////////////////////////////////////////////////////////////////////////////////////
// Mongo config
////////////////////////////////////////////////////////////////////////////////////////
var mongoose = require('mongoose');
mongoose.connect('mongodb://prodsa:password@ds025389.mlab.com:25389/acnode');

//var Schema = mongoose.Schema;
var addresscacheSchema = mongoose.Schema({
	address1: String,
	address2: String,
	address3: String,
	city: String,
	state: String,
	zip: String,
	hashcode: String,
	latitude: Number,
	longitude: Number,
	created_at: Date,
	updated_at: Date
});

addresscacheSchema.pre('save', function(next) {
	// runs before every save
 	var currentDate = new Date();
  
 	// change the updated_at field to current date
  	this.updated_at = currentDate;

	// if created_at doesn't exist, add to that field
	if (!this.created_at)
		this.created_at = currentDate;

	next();
});

var AddressCache = mongoose.model('AddressCache', addresscacheSchema);

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////
// GETs
////////////////////////////////////////////////////////////////////////////////////////
router.get('/:id', function(req, res) {
	var items = AddressCache.find({ _id: req.params.id }, function(err, item) {
		if(err) {
			throw err;
		} 

		console.log(item);
		res.json({ cachedItem: item });
	});


	
	
});

router.get('/findByHashCode/:hash', function(req, res) {
	var items = AddressCache.find({ hashcode: req.params.hash }, function(err, item) {
		if(err) {
			throw err;
		} 

		console.log(item);
		res.json({ cachedItem: item });
	});
	
});

router.get('/findByPartialAddress/:addr1/:city/:state/:zip5', function(req, res) {
	var zip5 = utils.fiveDigitZip(req.params.zip5);
	var items = AddressCache.find({ address1: new RegExp('^' + req.params.addr1 + '$', "i"),
						city: new RegExp('^' + req.params.city + '$', "i"),
						state: new RegExp('^' + req.params.state + '$', "i"),
					    zip: zip5 }, function(err, items) {
		if(err) {
			throw err;
		} 

		console.log(items);
		res.json({ cachedItem: items });
	});
});

router.get('/findbyCityStateZip/:city/:state/:zip5', function(req, res) {
	var zip5 = utils.fiveDigitZip(req.params.zip5);
	var items = AddressCache.find({ city: new RegExp('^' + req.params.city + '$', "i"),
						state: new RegExp('^' + req.params.state + '$', "i"),
					    zip: zip5 }, function(err, items) {
		if(err) {
			throw err;
		} 

		console.log(items);
		res.json({ cachedItem: items });
	});
});

router.get('/findByCityState/:city/:state', function(req, res) {
	var items = AddressCache.find({ city: new RegExp('^' + req.params.city + '$', "i"),
						state: new RegExp('^' + req.params.state + '$', "i")}, function(err, items) {
		if(err) {	
			throw err;
		} 

		console.log(items);
		res.json({ cachedItem: items });
	});
});

router.get('/findByState/:state', function(req, res) {
	var items = AddressCache.find({ state: new RegExp('^' + req.params.state + '$', "i")}, function(err, items) {
		if(err) {
			throw err;
		} 

		console.log(items);
		res.json({ cachedItem: items });
	});
});

router.get('/findByZip5/:zip5', function(req, res) {
	var zip5 = utils.fiveDigitZip(req.params.zip5);
	var items = AddressCache.find({ zip: zip5 }, function(err, items) {
	    if(err) {
			throw err;
		} 

		console.log(items);
		res.json({ cachedItem: items });
	});
});

router.get('/findByLatLong/:lat/:long/:radius', function(req, res) {
	// get from database
	var items = AddressCache.find({ latitude: req.params.lat,
						longitude: req.params.long,
					    radius: req.params.radius }, function(err, items) {
		if(err) {
			throw err;
		} 

		console.log(items);
		res.json({ cachedItem: items });
	});
});

router.get('/findByZipAndRadius/:zip5/:radius', function(req, res) {
	// get from database
	var items = AddressCache.find({ zip: req.params.zip5,
					    radius: req.params.radius }, function(err, items) {
		if(err) {
			throw err;
		} 

		console.log(items);
		res.json({ cachedItem: items });
	});
});

router.get('/findByCityStateAndRadius/:city/:state/:radius', function(req, res) {
	// get from database

	var items = AddressCache.find({ city: new RegExp('^' + req.params.city + '$', "i"),
						state: new RegExp('^' + req.params.state + '$', "i"),
					    radius: req.params.radius }, function(err, items) {
		if(err) {
			throw err;
		} 

		console.log(items);
		res.json({ cachedItem: items });
	});
});

router.get('/findByNoLatLong', function(req, res) {
	// get from database
	var items = AddressCache.find({ $or: [ {latitude: {$in: [null] }}, {longitude: {$in: [null] } }]}, function(err, items) {
		if(err) {
			throw err;
		} 

		console.log(items);
		res.json({ cachedItem: items });
	});
});

router.get('/getHashCodeCount/:hash', function(req, res) {
	var hashCode = req.params.hash;

	AddressCache.where({ "hashcode": hashCode }).count(function(err, itemCount) {
		if(err) {
			throw err;
		} 

		if(itemCount > 0) {
			console.log('Found some records: ' + itemCount);
			res.json({ recordCount: itemCount});
		}
		else if(itemCount == 0) {
			console.log('Found 0 records');
			res.json({ recordCount: itemCount});
		}
		else {
			console.log('Undetermined record count for HashCode: ' + hashCode);
			res.json({ recordCount: 'Undefined or NULL'});
		}
	});

	
});

router.get('/getCountById/:id', function(req, res) {
	var Id = req.params.id;

	AddressCache.where({ "_id": Id }).count(function(err, itemCount) {
		if(err) {
			throw err;
		} 

		if(itemCount > 0) {
			console.log('Found some records: ' + itemCount);
			res.json({ recordCount: itemCount});
		}
		else if(itemCount == 0) {
			console.log('Found 0 records');
			res.json({ recordCount: itemCount});
		}
		else {
			console.log('Undetermined record count for _id: ' + Id);
			res.json({ recordCount: 'Undefined or NULL'});
		}
	});

	
});


////////////////////////////////////////////////////////////////////////////////////////
// POSTs
////////////////////////////////////////////////////////////////////////////////////////
// intercept route, json parser middleware runs, then calls next()
router.post('/', jsonParser , function(req, res) {
	var hashCode = utils.getAddressHashCode(req.body.addr1,
											req.body.addr2,
											req.body.addr3,
											req.body.city,
											req.body.state,
											req.body.zip);

	// Probably a good place for Promises
	AddressCache.where({ "hashcode": hashCode }).count(function(err, itemCount) {
		if(err) {
			throw err;
		} 

		if(itemCount > 0) {
			console.log('Found records: ' + itemCount + '.  Please update existing record for HashCode: ' + hashCode);
			res.json({ 'Message' : 'Found records: ' + itemCount + '.  Please update existing record for HashCode: ' + hashCode});
		}
		else {
			console.log('Nothing found for HashCode: ' + hashCode);
			// if record already exists, we should return a message saying it already exists
			// if you want to update a record, call the PUT method
			var ac = AddressCache({
				address1: req.body.addr1,
				address2: req.body.addr2,
				address3: req.body.addr3,
				city: req.body.city,
				state: req.body.state,
				zip: req.body.zip,
				hashcode: hashCode,
				latitude: req.body.lat,
				longitude: req.body.long
			});

			ac.save(function(err) {
				if(err)  {
					throw err;
				}

				console.log('Adding ' + hashCode);
				res.send('Adding ' + hashCode);
			});

		}
	});
});





////////////////////////////////////////////////////////////////////////////////////////
// PUTs
////////////////////////////////////////////////////////////////////////////////////////
router.put('/', jsonParser , function(req, res) {
	// save to db
	var hash = req.body.hash;
	var addr1 = req.body.addr1;
	var addr2 = req.body.addr2;
	var addr3 = req.body.addr3;
	var city = req.body.city;
	var state = req.body.state;
	var zip = req.body.zip;
	var lat = req.body.lat;
	var long = req.body.long;


	res.send('Updating ' + req.body.hash);
	console.log(req.params.hash);
});




////////////////////////////////////////////////////////////////////////////////////////
// DELETEs
////////////////////////////////////////////////////////////////////////////////////////
router.delete('/:id', function(req, res) {
	// delete from database
	AddressCache.find({ _id: req.params.id }).remove(function(err) {
		if(err) throw err;

		console.log('Deleted: ' + req.params.id);
		res.send('Deleting ' + req.params.id);
	});

});

router.delete('/deleteByHash/:hash', function(req, res) {
	// delete from database
	AddressCache.find({ hashcode: req.params.hash }).remove(function(err) {
		if(err) throw err;

		console.log('Deleted: ' + req.params.hash);
		res.send('Deleting ' + req.params.hash);
	});

});





module.exports = router;