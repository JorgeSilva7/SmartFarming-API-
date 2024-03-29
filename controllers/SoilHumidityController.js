var mongoose = require('mongoose');
var SoilHumidity = mongoose.model('SoilHumidity');
var SmartHardware = mongoose.model('SmartHardware');

exports.findLastHardwareSoilHumidities = async function(req, res){
	await SmartHardware.findOne({'apikey' : req.body.apikey}, function(err, hw){
		if(err){
			error = true;
			return res.status(500).jsonp(err);
		}
		if(hw == null){
			error = true;
			return res.status(500).jsonp({'error' : 'apikey no encontrada'});
		}

		SoilHumidity.find({'hwID' : hw._id})
		.limit(10)
		.sort({'createdAt': -1})
		.exec(
			function(err, soilhumidities){
				var count = Object.keys(soilhumidities).length;
				if(count == 0) return res.status(404).jsonp({'error' : 'No hay humedad de suelo'});
				return res.status(200).jsonp(soilhumidities.sort(custom_sort));
			}
			);
	});
}

//Agrega una nueva temperatura
exports.addSoilHumidity = async function(apikey, data){

	let soilhumidityValue = data;

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

	var soilhumidity = new SoilHumidity({
		createdAt: date.getTime(),
		hwID: currentHw._id,
		data: soilhumidityValue,
	});

	soilhumidity.save(function(err, soilhumidity){
		if(err) return;
		return;
	});
}

function custom_sort(a, b) {
    return a.createdAt - b.createdAt;
}