var fetch = require('node-fetch')
var FormData = require('form-data')
var he = require("he")

module.exports = {
	comment: function (req, res) {
		if(req.isSocket) {
			let socketId = sails.sockets.getId(req);
			sails.sockets.join(socketId, "tt_room", function () {
				sails.sockets.broadcast('tt_room', 'connected', {message: 'Someone has connected to server'}, req)
				// emulator user session
				var uid = Math.floor((Math.random() * 1000) + 1) + 949691;
				var nid = 56;
				var checkJoin = new Promise((resolve, reject) => {
					News_comment.find({
						nid: nid
					}).then((found) => {
						resolve(found)
					}).catch((err) => {
						console.log(err);
						reject(1)
					})
				});

				checkJoin.then(news_comment => {
					return new Promise((resolve, reject) => {
						Comment_new.find({
							uid: uid
						}).then(comments => {
							var comment_ids = []
							for(let i = 0; i < news_comment.length; i ++) {
								for(let j = 0; j < comments.length; j ++) {
									if(news_comment[i].cid == comments[j].cid) {
										if(comments[j].reply_to == 0)
											comment_ids.push(news_comment[i].cid)
										else
											comment_ids.push(news_comment[i].reply_to)
									}
								}
							}
							resolve(comment_ids)
						}).catch(err => {
							console.log(err);
						})
					})
				}).then(allComment => {
					for(let i = 0; i < allComment.length; i ++) {
						sails.sockets.join(socketId, allComment[i])
					}
				}).catch(err => {
					console.log(err)
					console.log("no room to care")
				})
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
			return res.json(403, "You don\'t have permission to access");
		}

		var socketId = sails.sockets.getId(req);

		var form = new FormData();
		var comment = req.body.comment;
		var nid = req.body.nid;
		var uid = req.body.uid;
		var ip = req.body.ip;
		var reply_to = req.body.reply_to;
		var promoted = req.body.promoted;

		form.append('nid', nid);
		form.append('uid', uid);
		form.append('ip', ip);
		form.append('content', comment);

		if (typeof reply_to != 'undefined') {
			form.append('reply_to', reply_to);
		}
		if (typeof promoted != 'undefined') {
			form.append('promoted', promoted);
		}

		// Check user
		var checkExistUser = new Promise(function (resolve, reject) {
			var uid = parseInt(uid);
			if(isNaN(uid) || uid == 0) {
				res.json({message: "User is not defined !"});
				res.end()
			}
			else {
				Users.findOne({
					uid: uid
				}).then(function (found) {
					resolve(1);
				}).catch(function (err) {
					reject(err);
				})
			}
		});
		checkExistUser.then(function (isExist) {
			// Check online
			Sessions.findOne({
				uid: uid
			}).then(function (found) {
				resolve(found);
			}).catch(function (err) {
				throw err;
			})
		}).then(function (user) {
			console.log(user);
			// form.append('uname', user.name);

			fetch('http://localhost:1337/comments/create', {method: "POST", body: form})
			.then(res => res.json())
	    	.then(json => {
	    		if (typeof reply_to != 'undefined') {
	    			sails.sockets.join(socketId, reply_to, () => {});
	    			// sails.sockets.join(socketId, 'tt_room', () => {});
	    			sails.sockets.broadcast('tt_room', 'commented', {status: 1, data: {c: comment, u: uname, r: parseInt(reply_to), m:1}}, req);
	    			sails.sockets.broadcast(reply_to, 'reply', {status: 1, data: {c: comment, u: uname, r: parseInt(reply_to), m:1}}, req);
	    		}
	    		else {
	    			sails.sockets.join(socketId, json.data[0].comment_id, () => {});
	    			// sails.sockets.join(socketId, 'tt_room', () => {});
	    			sails.sockets.broadcast('tt_room', 'commented', {status: 1, data: {c: comment, u: uname, r: json.data[0].comment_id, m: 0}}, req);
	    		}
	    		res.json({status: 1, data: {c: comment, u: uname, r: json.data[0].comment_id}});
	    	})
	    	.catch(function (err) {
				throw err;
			})
		}).catch(function(err) {
			res.json({message: "Có lỗi xảy ra khi thêm bình luận"})
			res.end()
		})
	}
}