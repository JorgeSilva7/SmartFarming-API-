exports = module.exports = function(app, mongoose){

var smartSchema = new mongoose.Schema({
	userID: {type: mongoose.Schema.Types.ObjectId, required: true},
	apikey: {type: String, required: true, unique: true},
	description: String,
});

module.exports = mongoose.model('SmartHardware', smartSchema);
};