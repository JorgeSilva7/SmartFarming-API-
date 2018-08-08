exports = module.exports = function(app, mongoose){

var userSchema = new mongoose.Schema({
	token: {type: String, required: false},
	name: {type: String, required: true}, 
	lastName: String,
	email: {type: String, lowercase: true, required: true, unique: true},
	password : {type: String, required: true}
});

module.exports = mongoose.model('User', userSchema);
};