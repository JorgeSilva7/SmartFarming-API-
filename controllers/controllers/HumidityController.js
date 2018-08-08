var mongoose = require('mongoose');
var Humidity = mongoose.model('Humidity');

//GET - Retorna todas las temperaturas de la BD
exports.findAllHumidities = function(req, res){
	Humidity.find(function(err, humidities){
		if(err) res.send(500, err.message);

		console.log('GET /humidity');
		res.status(200).jsonp(humidities);
	});
};

//POST - Agrega una nueva temperatura a la BD
exports.addHumidity = function(req, res){
	console.log('POST');
	console.log(req.body);

	var humidity = new Humidity({
		humidity: req.body.humidity,
	});

	if(req.body.humidity==null) return res.status(500).send("ERROR");

	humidity.save(function(err, temp){
		if(err) return res.status(500).send(err.message);
	res.status(200).json(humidity);
	});
};