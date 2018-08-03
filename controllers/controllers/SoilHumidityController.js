var mongoose = require('mongoose');
var SoilHumidity = mongoose.model('SoilHumidity');

//GET - Retorna todas las temperaturas de la BD
exports.findAllSoilHumidities= function(req, res){
	SoilHumidity.find(function(err, SoilHumidities){
		if(err) res.send(500, err.message);

		console.log('GET /soilhumiditiy');
		res.status(200).jsonp(SoilHumidities);
	});
};

//POST - Agrega una nueva temperatura a la BD
exports.addSoilHumidity = function(req, res){
	console.log('POST');
	console.log(req.body);

	var soilHumidity = new SoilHumidity({
		soilHumidity: req.body.soilhumidity,
	});

	if(req.body.soilHumidity==null) return res.status(500).send("ERROR");

	soilHumidity.save(function(err, temp){
		if(err) return res.status(500).send(err.message);
	res.status(200).json(soilHumidity);
	});
};