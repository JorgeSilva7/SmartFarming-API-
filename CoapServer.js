var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var mongoose = require('mongoose');
var coap = require('coap');
var server = coap.createServer();

module.exports = app;

mongoose.connect('mongodb://localhost/smartFarming', function(err, res){
	if(err){
		console.log('Error al conectar a la Base de datos. '+err);
	}
});

app.use(bodyParser.urlencoded({ extended : false}));
app.use(bodyParser.json());
app.use(methodOverride());

var UserModel = require('./models/User')(app, mongoose);
var UserController = require('./controllers/UserController');
var SmartHardwareModel = require('./models/SmartHardware')(app, mongoose);
var SmartHardwareController = require('./controllers/SmartHardwareController');
var TempModel = require('./models/Temp')(app, mongoose);
var TempController = require('./controllers/TempController');
var HumidityModel = require('./models/Humidity')(app, mongoose);
var HumidityController = require('./controllers/HumidityController');
var PumpModel = require('./models/Pump')(app, mongoose);
var PumpController = require('./controllers/PumpController');
var SoilHumidityModel = require('./models/SoilHumidity')(app, mongoose);
var SoilHumidityController = require('./controllers/SoilHumidityController');

var userModel = mongoose.model('User');

//Api routes
var smartfarmingweb = express.Router();
var smartfarming = express.Router();
var auth = express.Router();

smartfarmingweb.use(async function(req, res, next) {
	var token = req.body.token;
	let currentuser = null;
	await userModel.findOne({'token': token}, function(err, user){
		currentuser = JSON.parse(JSON.stringify(user));
	});
	if(token != null && currentuser!= null && token == currentuser.token){
		res.setHeader('Access-Control-Allow-Origin', '*');
		next();
	}else{
		res.setHeader('Access-Control-Allow-Origin', '*');
		return res.status(403).send({ 
			success: false, 
			message: 'No tiene permisos para hacer esto.' 
		});
	}
});

//Rutas Temperatura
smartfarmingweb.route('/hwtemps')
.post(TempController.findLastHardwareTemps);

//Rutas Humedad
smartfarmingweb.route('/hwhumidities')
.post(HumidityController.findLastHardwareHumidities);

//Rutas Humedad Suelo
smartfarmingweb.route('/hwsoilhumidities')
.post(SoilHumidityController.findLastHardwareSoilHumidities);

//Rutas Bomba de Agua
smartfarmingweb.route('/hwpumps')
.post(PumpController.findLastHardwarePumps);

//Rutas Hardware
smartfarmingweb.route('/hardware')
.get(SmartHardwareController.listAllHardwares)
.post(SmartHardwareController.addHardware);
smartfarmingweb.route('/userhardwares')
.post(SmartHardwareController.listUserHW);
smartfarmingweb.route('/userhardware')
.post(SmartHardwareController.getHardware);

smartfarming.route('/user')
.post(UserController.addUser)
.get(UserController.listUsers);

auth.route('/login')
.post(UserController.loginUser);

app.use('/smartfarming', auth);
app.use('/smartfarming', smartfarming);
app.use('/smartfarming', smartfarmingweb);

server.on('request', function(req, res) {
	let url = req.url.split('/');

	if(url[1] == 'data'){
		let payload = req.payload.toString('utf8');
		payload = payload.replace(/ /g, "");
		payload = payload.split(';');

		let apikey = payload[0];
		let temp = payload[1];
		let humidity = payload[2];
		let soilHumidity = payload[3];

		TempController.addTemp(apikey, temp);
		HumidityController.addHumidity(apikey, humidity);
		SoilHumidityController.addSoilHumidity(apikey, soilHumidity);
	}

	if(url[1] ==  'pump'){
		let payload = req.payload.toString('utf8');
		payload = payload.replace(/ /g, "");
		payload = payload.split(';');

		let apikey = payload[0];
		let pump = payload[1];
		PumpController.addPump(apikey, pump);
	}
});

app.listen(3000, function(){
	console.log("Servidor Iniciado en http://localhost:3000");
	server.listen(function(){
		console.log('server started');
	});
});


