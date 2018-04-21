var fetch = require('node-fetch')
var FormData = require('form-data')
var he = require("he")
const SAILS_HOST = "http://localhost:1337"
// process.on('unhandledRejection', (reason, p) => {
//   console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
//   // application specific logging, throwing an error, or other logic here
// });
module.exports = {
	commentRooms: function (req, res) {
		if(req.isSocket) {
			var checkJoin = new Promise((resolve, reject) => {
				if(req.body.aid && typeof req.body.nid == "undefined") {
					Game_comment.find({
						aid: req.body.aid
					}).then((found) => {
						sails.sockets.join(req, "apps_tt_room_"+req.body.aid);
						resolve(found)
					}).catch((err) => {
						console.log(err);
						reject(1)
					})
				}
				else if(req.body.nid && typeof req.body.aid == "undefined") {
					News_comment.find({
						nid: req.body.nid
					}).then((found) => {
						sails.sockets.join(req, "tt_room_"+req.body.nid);
						resolve(found)
					}).catch((err) => {
						console.log(err);
						reject(1)
					})
				}
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
					sails.sockets.join(req, allComment[i].toString())
				}
				return res.json(200, "This request has been joined all related rooms")
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
		if(!req.isSocket) {
			return res.json(403, "You don\'t have permission to access");
		}

		var form = new FormData();
		var nid = req.body.nid;
		var aid = req.body.aid;
		if(aid && typeof nid == "undefined") {
			form.append('aid', req.body.aid);
		}
		else if(nid && typeof aid == "undefined") {
			form.append('nid', req.body.nid);
		}

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
				if(typeof found != "undefined") {
					resolve(found);
				}
				else {
					throw "User dose not exist!"
				}
			}).catch(function (err) {
				reject(err);
			})
		});
		checkExistUser.then(function (isExist) {
			return new Promise(function (resolve, reject) {
				// Check online
				Sessions.findOne({
					sid: req.body.sid,
					uid: isExist.uid
				}).then(function (found) {
					if(typeof found != "undefined") {
						if(req.body.status == 1) {
							// admins array(app10 in ActionBase line 22)
							let admins = [
					            860700,
					            6152817,
					            448,
					            1076396,
					            1076421,
					            993928,
					            1076407,
					            1077337,
					            1511956,
					            949691,
					            950260,
					            981825,
					            1075980,
					            1076416,
					            1076425,
					            10041104,
					            1165962,
					            243663,
					            444,
					            12,
					            85592,
					            9576770,
					            300819,
					            8372072,
					            9822963,
					            8438905,
					            8438882,
					            13403278,
					            9409179,
					            6797913,
					            5562926,
					            7940016,
					            7939076,
					            11483358,
					            13074184,
					            7179714,
					            12283573,
					            9628607,
					            17740618,
					            8617960,
					            14794545,
					            18458757,
					            9979982,
					            367484,
					            9079728,
					            17967407,
					            18011132,
					            18014303,
					            16043906,
					            9262240,
					            9105055,
					            7683352,
					            14576867,
					            19273405,
					            18256421,
					            19273511,
					            5260047,
					            19344717,
					            19341175,
					            16746645,
					            15899324,
					            18619989,
					            15106018,
								16321209,
								20029840,
								20030009
					        ]
					        if (admins.indexOf(found.uid) != -1){
					        	form.append('type', 1);
					         	resolve(found);   
					        }
					        else {
					        	reject(1)
					        }
					    }
					    else {
					    	form.append('type', 0);
					    	resolve(found);
					    }
					}
					else {
						throw "User session is not valid !"
					}
				}).catch(function (err) {
					// throw err;
					throw "Invalid property ! Ignore request";
				})
			})
		}).then(function (user) {
			form.append('uname', user.name);

			fetch(SAILS_HOST+'/comments/create', {method: "POST", body: form})
			.then(res => res.json())
	    	.then(json => {
	    		// sails.sockets.broadcast("tt_room", "hello", {status: 1, data: {c: json.data[0].content, u: user.name, r: json.data[0].comment_id, m: 0}}, req)
	    		if (req.body.reply_to != 0) {
	    			sails.sockets.join(req, req.body.reply_to.toString());
	    			// below broadcast used to notify to specific sockets which are related to this reply
	    			// sails.sockets.broadcast("" + req.body.reply_to, "reply", {status: 1, data: {content: json.data[0].content, uname: user.name, uid: user.uid, cid: json.data[0].comment_id, reply: parseInt(req.body.reply_to), time: json.data[0].time, m:1}}, req);
	    			if(req.body.aid && typeof req.body.nid == "undefined") {
	    				sails.sockets.broadcast("apps_tt_room_"+req.body.aid, "reply", {status: 1, data: {content: json.data[0].content, uname: user.name, uid: user.uid, cid: json.data[0].comment_id, reply: parseInt(req.body.reply_to), time: json.data[0].time, m:1}}, req);
	    			}
	    			else if(req.body.nid && typeof req.body.aid == "undefined"){
	    				sails.sockets.broadcast("tt_room_"+req.body.nid, "reply", {status: 1, data: {content: json.data[0].content, uname: user.name, uid: user.uid, cid: json.data[0].comment_id, reply: parseInt(req.body.reply_to), time: json.data[0].time, m:1}}, req);
	    			}
	    			res.json({status: 1, data: {content: json.data[0].content, uname: user.name, uid: user.uid, cid: json.data[0].comment_id, reply: parseInt(req.body.reply_to), time: json.data[0].time}});
	    		}
	    		else {
	    			sails.sockets.join(req, json.data[0].comment_id.toString());
	    			if(req.body.aid && typeof req.body.nid == "undefined") { 
	    				sails.sockets.broadcast("apps_tt_room_"+req.body.aid, "comment", {status: 1, data: {content: json.data[0].content, uname: user.name, uid: user.uid, cid: json.data[0].comment_id, time: json.data[0].time, m: 0}}, req);
	    			}
	    			else if(req.body.nid && typeof req.body.aid == "undefined") {
	    				sails.sockets.broadcast("tt_room_"+req.body.nid, "comment", {status: 1, data: {content: json.data[0].content, uname: user.name, uid: user.uid, cid: json.data[0].comment_id, time: json.data[0].time, m: 0}}, req);
	    			}
	    			res.json({status: 1, data: {content: json.data[0].content, uname: user.name, uid: user.uid, cid: json.data[0].comment_id, time: json.data[0].time}});
	    		}
	    	})
	    	.catch(function (err) {
				// throw err;
				// ignore all fake request from client then throw below error
				throw "I am fake request, reject me !"
			})
		}).catch(function(err) {
			console.log(err)
			return res.json({status: 0, message: "Có lỗi xảy ra khi thêm bình luận"})
		})
	}
}