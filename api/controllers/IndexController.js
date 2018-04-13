module.exports = {
	index: function (req, res) {
		return res.json(200, 'ok')
	},
	testModel: function (req, res) {
		res.end();
	},
	testPopulate: function (req, res) {
		Users.find().exec(function (err, result) {
			if(err) throw err;
			sails.log.info(result);
			res.end()
		})
	},
};

