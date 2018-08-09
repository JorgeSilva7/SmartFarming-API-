var mongoose = require('mongoose');
var Relay = mongoose.model('Relay');
var SmartHardware = mongoose.model('SmartHardware');

exports.findLastHardwareRelays = async function(req, res){
	await SmartHardware.findOne({'apikey' : req.body.apikey}, function(err, hw){
		if(err){
			error = true;
			return res.status(500).jsonp(err);
		}
		if(hw == null){
			error = true;
			return res.status(500).jsonp({'error' : 'apikey no encontrada'});
		}

		Relay.find({'hwID' : hw._id})
		.limit(100)
		.sort({'createdAt': -1})
		.exec(
			function(err, relays){
				var count = Object.keys(relays).length;
				if(count == 0) return res.status(404).jsonp({'error' : 'No hay relays'});
				return res.status(200).jsonp(relays.sort(custom_sort));
			}
			);
	});
}

//Agrega una nuevo relay
exports.addRelay = async function(apikey, relay){

	let relayValue = relay;
	
	var error;

	await SmartHardware.findOne({'apikey' : apikey}, function(err, hw){
		if(err){
			error = true;
			return;
		}
		if(hw == null){
			error = true;
			return;
		}
		currentHw = hw;
	});
	if(error) return;

	let date = new Date();

	var relay = new Relay({
		createdAt: date.getTime(),
		hwID: currentHw._id,
		number: relayValue,
	});

	relay.save(function(err, relay){
		if(err) return;
		res.status(200).jsonp(relay);
	});
}

function custom_sort(a, b) {
    return a.createdAt - b.createdAt;
}