var mongoose = require('mongoose');
var Temp = mongoose.model('Temp');
var User = mongoose.model('User');
var SmartHardware = mongoose.model('SmartHardware');

//GET - Retorna todas las temperaturas de la BD
exports.findAllTemps = function(req, res){
	Temp.find()
				.sort({'createdAt': -1})
				.limit(5)
				.exec(
					function(err, temps){
						var count = Object.keys(temps).length;
						if(count == 0) return res.status(201).jsonp({'error' : 'No hay temperaturas'});

						return res.status(200).jsonp(temps);
					}
				);
}

exports.findLastHardwareTemps = async function(req, res){
	await SmartHardware.findOne({'apikey' : req.body.apikey}, async function(err, hw){
		if(err){
			error = true;
			return res.status(500).jsonp(err);
		}
		if(hw == null){
			error = true;
			return res.status(500).jsonp({'error' : 'apikey no valida'});
		}

		Temp.find({'hwID' : hw._id})
				.sort({'createdAt': -1})
				.limit(5)
				.exec(
					function(err, temps){
						var count = Object.keys(temps).length;
						if(count == 0) return res.status(201).jsonp({'error' : 'No hay temperaturas'});

						return res.status(200).jsonp(temps);
					}
				);
	});
}

//Agrega una nueva temperatura
exports.addTemp = async function(req, res){
	let payload = req.payload.toString('utf8');

	let payloadArray = payload.split(";");

	let apikey = payloadArray[0];

	let tempValue = payloadArray[1];

	let userTemp;
	
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


	var temp = new Temp({
		hwID: currentHw._id,
		temp: tempValue,
	});

	temp.save(function(err, temp){
		if(err) return;
		checkTemp(temp.temp, res);
	});
}

checkTemp = function (temp,res){
	if(temp>25) return res.end(1);
	if(temp<15) return res.end(-1);
	return res.end(0);
}