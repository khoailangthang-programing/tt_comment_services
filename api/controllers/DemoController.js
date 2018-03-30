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
				fetch('http://localhost:1337/comments?page=1&filter[nid]=56')
				    .then(function(response) {
				       return response.text();
				    })
				    .then(function(myJson) {
				       return res.json(JSON.parse(myJson));
				});
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
		var reply_to = req.param("reply_to");

		form.append('nid', 56);
		form.append('uid', 949691);
		form.append('uname', uname);
		if (typeof reply_to != 'undefined') {
			form.append('reply_to', reply_to);
		}
		form.append('ip', '192.255.10.10');
		form.append('content', he.encode(comment));

		fetch('http://localhost:1337/comments/create', {method: "POST", body: form})
		.then(res => res.json())
    	.then(json => {
    		if (typeof reply_to != 'undefined') {
    			sails.sockets.broadcast('tt_room', 'commented', {status: 1, data: {c: comment, u: uname, r: parseInt(reply_to), m:1}}, req);
    		}
    		else {
    			sails.sockets.broadcast('tt_room', 'commented', {status: 1, data: {c: comment, u: uname, r: json.data[0].comment_id, m: 0}}, req);
    		}
    		res.json({status: 1, data: {c: comment, u: uname, r: json.data[0].comment_id}});
    	})
    	.catch(function (err) {
			throw err
		})
	}
}