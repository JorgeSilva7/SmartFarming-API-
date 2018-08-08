var mongoose = require('mongoose');
var Temp = mongoose.model('Temp');
var SmartHardware = mongoose.model('SmartHardware');

exports.findLastHardwareTemps = async function(req, res){
	await SmartHardware.findOne({'apikey' : req.body.apikey}, function(err, hw){
		if(err){
			error = true;
			return res.status(500).jsonp(err);
		}
		if(hw == null){
			error = true;
			return res.status(500).jsonp({'error' : 'apikey no encontrada'});
		}

		Temp.find({'hwID' : hw._id})
		.limit(10)
		.sort({'createdAt': -1})
		.exec(
			function(err, temps){
				var count = Object.keys(temps).length;
				if(count == 0) return res.status(404).jsonp({'error' : 'No hay temperaturas'});
				return res.status(200).jsonp(temps.sort(custom_sort));
			}
			);
	});
}

//Agrega una nueva temperatura
exports.addTemp = async function(apikey, data){

	let tempValue = data;
	
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

	var temp = new Temp({
		createdAt: date.getTime(),
		hwID: currentHw._id,
		data: tempValue,
	});

	temp.save(function(err, temp){
		if(err) return;
		return;
	});
}

function custom_sort(a, b) {
    return a.createdAt - b.createdAt;
}