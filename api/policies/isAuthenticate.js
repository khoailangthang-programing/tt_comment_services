const tamtayIds_model = require('../models/Users')

module.exports = function (req, res, next) {
	var params = req.validate({
		uid: "numeric"
	}, false)
	if(!params) {
		return res.json(403, {status: 0, errors: 'You are not permitted to perform this action'});
	}
	var filter = {}
	filter = {uid: params.uid}
	var isUser = tamtayIds_model.isUser(filter, function (err, result) {
		if(err) {
			console.log(err)
			return res.json(403, {status: 0, errors: 'You are not permitted to perform this action'});
		}
		return next();
	});
	
}