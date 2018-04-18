var fetch = require('node-fetch')
var FormData = require('form-data')
var he = require("he")
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});
module.exports = {
	commentRooms: function (req, res) {
		// console.log(req)
		// sails.sockets.join(req, "tt_room");
		// sails.sockets.broadcast("tt_room", "hello", {data: "new"}, req)
		// return res.json(200, "ok")
		if(req.isSocket) {
			sails.sockets.join(req, "tt_room");

			var uid = req.body.uid;
			var nid = req.body.nid;
			var checkJoin = new Promise((resolve, reject) => {
				News_comment.find({
					nid: req.body.nid
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
						uid: req.body.uid
					}).then(comments => {
						let comment_ids = []
						for(let i = 0; i < news_comment.length; i ++) {
							for(let j = 0; j < comments.length; j ++) {
								if(news_comment[i].cid == comments[j].cid) {
									if(comments[j].reply_to == 0) {
										comment_ids.push(comments[j].cid)
									}
									else {
										if(comment_ids.indexOf(comments[j].reply_to) == -1) {
											comment_ids.push(comments[j].reply_to)
										}
									}
								}
							}
						}
						resolve(comment_ids)
					}).catch(err => {
						throw err;
					})
				})
			}).then(allComment => {
				for(let i = 0; i < allComment.length; i ++) {
					sails.sockets.join(req, '' + allComment[i])
				}
				return res.json(200, "This request has been joined all relate room")
			}).catch(err => {
				console.log("no room to care")
				throw err
			})
		}
		else {
			return res.json(403, "You don\'t have permission to access");
		}
	},
	postComment: function (req, res) {
		// sails.sockets.broadcast("tt_room", "hello", {data: "new"}, req)
		// return res.json(200, "ok")
		if(!req.isSocket) {
			return res.json(403, "You don\'t have permission to access");
		}

		var form = new FormData();
		form.append('nid', req.body.nid);
		form.append('uid', req.body.uid);
		form.append('ip', req.body.ip);
		form.append('content', req.body.comment);

		if (typeof req.body.reply_to != 'undefined') {
			form.append('reply_to', req.body.reply_to);
		}
		if (typeof req.body.promoted != 'undefined') {
			form.append('promoted', req.body.promoted);
		}

		// Check user
		var checkExistUser = new Promise(function (resolve, reject) {
			Users.findOne({
				uid: req.body.uid
			}).then(function (found) {
				resolve(1);
			}).catch(function (err) {
				reject(err);
			})
		});
		checkExistUser.then(function (isExist) {
			return new Promise(function (resolve, reject) {
				// Check online
				Sessions.findOne({
					sid: req.body.sid
				}).then(function (found) {
					resolve(found);
				}).catch(function (err) {
					throw err;
				})
			})
		}).then(function (user) {
			form.append('uname', user.name);

			fetch('http://localhost:1337/comments/create', {method: "POST", body: form})
			.then(res => res.json())
	    	.then(json => {
	    		// sails.sockets.broadcast("tt_room", "hello", {status: 1, data: {c: json.data[0].content, u: user.name, r: json.data[0].comment_id, m: 0}}, req)
	    		if (req.body.reply_to != 0) {
	    			sails.sockets.join(req, "" + req.body.reply_to);
	    			sails.sockets.broadcast("" + req.body.reply_to, "reply", {status: 1, data: {content: json.data[0].content, uname: user.name, uid: user.uid, cid: json.data[0].comment_id, reply: parseInt(req.body.reply_to), time: json.data[0].time, m:1}}, req);
	    			res.json({status: 1, data: {content: json.data[0].content, uname: user.name, uid: user.uid, cid: json.data[0].comment_id, reply: parseInt(req.body.reply_to), time: json.data[0].time}});
	    		}
	    		else {
	    			sails.sockets.join(req, "" + json.data[0].comment_id);
	    			sails.sockets.broadcast("tt_room", "comment", {status: 1, data: {content: json.data[0].content, uname: user.name, uid: user.uid, cid: json.data[0].comment_id, time: json.data[0].time, m: 0}}, req);
	    			res.json({status: 1, data: {content: json.data[0].content, uname: user.name, uid: user.uid, cid: json.data[0].comment_id, time: json.data[0].time}});
	    		}
	    	})
	    	.catch(function (err) {
				throw err;
			})
		}).catch(function(err) {
			console.log(err)
			return res.json({message: "Có lỗi xảy ra khi thêm bình luận"})
		})
	}
}