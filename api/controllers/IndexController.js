// Test

module.exports = {
	index: function (req, res) {
		res.json(200, {message: 'OK !'})
	},
	testModel: function (req, res) {
		Comment_new.find().exec(function (err, result) {
			if (err) throw err;
			sails.log.info(result)
			res.end();
		})
	},
	testPopulate: function (req, res) {
		Users.find().exec(function (err, result) {
			if(err) throw err;
			sails.log.info(result);
			res.end()
		})
	}
};

