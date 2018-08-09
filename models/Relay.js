exports = module.exports = function(app, mongoose){

var relaySchema = new mongoose.Schema({
	hwID: {type: mongoose.Schema.Types.ObjectId, required: true},
	number : {type: Number, required: true},
	createdAt: {type: Number, required: true},
});

module.exports = mongoose.model('Relay', relaySchema);
}; 