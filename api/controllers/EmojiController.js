module.exports = {
	list: function (req, res) {
		var response = {
			status: 0,
			messages: []
		};
		Emoji.getEmoji({}, {}, function(error, result) {
			if (error) {
				res.json(400, {message: 'Error !'});
			}
			response.data = result;
			response.status = 1;
			res.json(response);
		});
	}
}