var mongoose = require('mongoose');
var Pump = mongoose.model('Pump');

//GET - Retorna todas las temperaturas de la BD
exports.findAllPumps = function(req, res){
	Pump.find(function(err, pumps){
		if(err) res.send(500, err.message);

		console.log('GET /pump');
		res.status(200).jsonp(pumps);
	});
};

//POST - Agrega una nueva temperatura a la BD
exports.addPump = function(req, res){
	console.log('POST');
	console.log(req.body);

	var pump = new Pump({
		pump: req.body.pump,
	});

	if(req.body.pump==null) return res.status(500).send("ERROR");

	pump.save(function(err, temp){
		if(err) return res.status(500).send(err.message);
	res.status(200).json(pump);
	});
};