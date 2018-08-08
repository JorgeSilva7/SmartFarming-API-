var mongoose = require('mongoose');
var SmartHardware = mongoose.model('SmartHardware');
var User = mongoose.model('User');

//Retorna todos los SmartHardware
exports.listAllHardwares = function(req, res){
	SmartHardware.find(function(err, hw){
		if(err) return res.send(500, err.message);
		return res.status(200).send(hw);
	});
}

exports.listUserHW = async function(req, res){
	let checkbodyresponse = checkBodyHW(req, res);
	if(checkbodyresponse != "") return res.status(500).send(checkbodyresponse);

	await SmartHardware.find({'userID' : req.body.userID}, async function(err, hws){
		if(err){
			error = true;
			return res.status(500).jsonp(err);
		}
		if(hws == null){
			error = true;
			return res.status(404).jsonp({'response' : 'No hay SmartFarming Hardwares'});
		}
		return res.status(200).jsonp(hws);
	});
}

exports.getHardware = async function(req, res){
	let checkbodyresponse = checkBodyHW(req, res);
	if(checkbodyresponse != "") return res.status(500).send(checkbodyresponse);

	await SmartHardware.find({'apikey' : req.body.apikey}, async function(err, hws){
		if(err){
			error = true;
			return res.status(500).jsonp(err);
		}
		if(hws == null){
			error = true;
			return res.status(404).jsonp({'response' : 'No hay SmartFarming Hardwares'});
		}
		return res.status(200).jsonp(hws);
	});
}

//Agrega un nuevo hardware
exports.addHardware = async function(req, res){

	var error=false;
	let currentUser;

	await User.findOne({'_id' : req.body.userID}, function(err, user){
		if(err){
			error = true;
			return res.status(500).send(err.message);
		}
		if(user == null){
			error = true;
			return res.status(401).send({"error" : "ID Usuario no encontrado"});
		}

		currentUser = user;
	});

	if(!error){
		var checkbodyresponse = checkBodyHW(req, res);
		if(checkbodyresponse != "") return res.status(200).send(checkbodyresponse);

		if(req.body == null) return res.status(500).send("BAD REQUEST");

		var smartHardware = new SmartHardware({
			userID : currentUser._id,
			apikey : req.body.apikey,
			description : req.body.description
		});

		smartHardware.save(function(err, hw){
			if(err) return res.status(501).send(err.message);
			return res.status(200).send(hw);
		});
	}
}

//Retorna json con error si es que lo hay en algun campo (al agregar usuario)
checkBodyHW = function (req, res){
	let error ="";
	if(req.body.userID == null) error = {"error": "Falta el id de usuario"};
	return error;
}


