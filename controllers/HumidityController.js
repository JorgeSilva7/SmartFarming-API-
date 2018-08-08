var mongoose = require('mongoose');
var Humidity = mongoose.model('Humidity');
var SmartHardware = mongoose.model('SmartHardware');

exports.findLastHardwareHumidities = async function(req, res){
	await SmartHardware.findOne({'apikey' : req.body.apikey}, function(err, hw){
		if(err){
			error = true;
			return res.status(500).jsonp(err);
		}
		if(hw == null){
			error = true;
			return res.status(500).jsonp({'error' : 'apikey no encontrada'});
		}

		Humidity.find({'hwID' : hw._id})
		.limit(10)
		.sort({'createdAt': -1})
		.exec(
			function(err, humidities){
				var count = Object.keys(humidities).length;
				if(count == 0) return res.status(404).jsonp({'error' : 'No hay humedades'});
				return res.status(200).jsonp(humidities.sort(custom_sort));
			}
			);
	});
}

//Agrega una nueva humedad
exports.addHumidity = async function(apikey, data){
	
	let humidityValue = data;
	
	let error;

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

	var humidity = new Humidity({
		createdAt: date.getTime(),
		hwID: currentHw._id,
		data: humidityValue,
	});

	humidity.save(function(err, humidity){
		if(err) return;
		return;
	});
}

function custom_sort(a, b) {
    return a.createdAt - b.createdAt;
}