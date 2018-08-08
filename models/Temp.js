exports = module.exports = function(app, mongoose){

var tempSchema = new mongoose.Schema({
	hwID: {type: mongoose.Schema.Types.ObjectId, required: true},
	data : {type: Number, required: true},
	createdAt: {type: Number, required: true}
});

module.exports = mongoose.model('Temp', tempSchema);
};