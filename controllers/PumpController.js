var mongoose = require('mongoose');
var Pump = mongoose.model('Pump');
var SmartHardware = mongoose.model('SmartHardware');

exports.findLastHardwarePumps = async function(req, res){
	await SmartHardware.findOne({'apikey' : req.body.apikey}, function(err, hw){
		if(err){
			error = true;
			return res.status(500).jsonp(err);
		}
		if(hw == null){
			error = true;
			return res.status(500).jsonp({'error' : 'apikey no encontrada'});
		}

		Pump.find({'hwID' : hw._id})
		.limit(100)
		.sort({'createdAt': -1})
		.exec(
			function(err, pumps){
				var count = Object.keys(pumps).length;
				if(count == 0) return res.status(404).jsonp({'error' : 'No hay bombas de agua'});
				return res.status(200).jsonp(pumps);
			}
			);
	});
}

//Agrega una nueva temperatura
exports.addPump = async function(req, res){
	//let payload = req.payload.toString('utf8');

	//let payloadArray = payload.split(";");

	//let apikey = payloadArray[0];

	//let tempValue = payloadArray[1];
	let pumpValue = req.body.number;
	let apikey = req.body.apikey;
	
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

	var pump = new Pump({
		createdAt: date.getTime(),
		hwID: currentHw._id,
		number: pumpValue,
	});

	pump.save(function(err, pump){
		if(err) return;
		res.status(200).jsonp(pump);
	});
}