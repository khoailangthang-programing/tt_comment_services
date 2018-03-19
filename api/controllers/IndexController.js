// Test

module.exports = {
	index: function (req, res) {
		res.json(200, {message: 'OK !'})
	},
	testModel: function (req, res) {
		Users.find().exec(function (err, result) {
			if (err) throw err;
			sails.log.info(result)
			res.end();
		})
	},
	testPopulate: function (req, res) {
		Users.find({
			where: {
				uid: 11975017
			}
		}).populate('comments').exec(function (err, result) {
			if(err) throw err;
			sails.log.info(result);
			res.end()
		})
	}
};

