var fetch = require('node-fetch')
var FormData = require('form-data')
var he = require("he")

module.exports = {
	comment: function (req, res) {
		if(req.isSocket) {
			let socketId = sails.sockets.getId(req);
			sails.log(socketId)
			sails.sockets.join(socketId, "tt_room", function () {
				sails.sockets.broadcast('tt_room', 'connected', {message: 'Someone has connected to server'}, req)
			});
		}
		else {
			return res.view('demo/comment', {
				outputJs: [
					"/js/socket.io.js"
				],
				title: "Comment demo"
			});
		}
	},
	postComment: function (req, res) {
		if(!req.isSocket) {
			return res.badRequest();
		}

		var socketId = sails.sockets.getId(req);
		sails.sockets.join(socketId, "tt_room", () => {});

		var form = new FormData();
		var comment = req.param("comment");
		var uname = req.param("name");

		form.append('nid', 56);
		form.append('uid', 949691);
		form.append('uname', uname);
		form.append('ip', '192.255.10.10');
		form.append('content', he.encode(comment));

		fetch('http://localhost:1337/comments/create', {method: "POST", body: form})
		.then(res => res.json())
    	.then(json => {
    		sails.sockets.broadcast('tt_room', 'commented', {status: 1, data: {c: comment, u: uname}}, req);
    	})
    	.catch(function (err) {
			throw err
		})
		return res.json({status: 1, data: {c: comment, u: uname}});
	}
}