var validator = require('validator');
var htmlEntities = require('he');

module.exports = {
	create: function (req, res) {
		var response = {
			status:  0,
			message: [],
			data:    [{}]
		}
		var fields = {};
		var flag_join = {};

		if(req.method != "POST") {
			response.message.push("Bad request. Return 400 !");
			return res.json(400, response);
		}
		var nid = req.validate({"nid": "numeric"}, false);
		var aid = req.validate({"aid": "numeric"}, false);
		if(!nid && !aid) {
			response.message.push("Newsid or Aid don't exist. Ignore request");
			return res.json(400, response);
		}
		else {
			if(!nid && aid) {
				flag_join.col = "game";
				flag_join.val = aid.aid;
			}
			else {
				flag_join.col = "news";
				flag_join.val = nid.nid;
			}
		}
		var params = req.validate([
			{"uid": "numeric"}, 
			{"uname": "string"},
			{"reply_to?": "int"},
			{"promoted?": "int"},
			{"ip": "ip"},
			{"content": "string"}
		], false);
		if(!params) {
			response.message.push("Invalid params. Ignore request");
			return res.json(400, response);
		}

		var validParamsCase = new Promise(function (resolve, reject) {
			if(!params.uid || !params.uname) {
				return reject(1);
			} else {
				fields.uid = params.uid;
				fields.uname = params.uname;
			}

			if(!params.promoted) {
				fields.promoted = 0;
			} else {
				fields.promoted = parseInt(params.promoted);
			}
			if(!params.reply_to) {
				fields.reply_to = 0;
				resolve(1);
			}
			else {
				Comment_new.findOne({
					cid: parseInt(params.reply_to)
				}).then(function (parrentComment) {
					if(typeof parrentComment != 'undefined') {
						fields.reply_to = parrentComment.cid;
						resolve(1);
					}
					else {
						reject("Undefined comment");
					}
				}).catch(function (err) {
					throw err;
				});
			}
		});
		validParamsCase.then(function (validParams) {
			// Insert to comment new
			return new Promise(function (resolve, reject) {
				fields.created = Math.floor((new Date()).getTime() / 1000);
				fields.changed = Math.floor((new Date()).getTime() / 1000);
				fields.content = htmlEntities.encode(params.content);
				fields.status = 1;
				fields.host = params.ip.split('.').reduce(function(ipInt, octet) {
					return (ipInt<<8) + parseInt(octet, 10)
				}, 0);
				Comment_new.create(fields).then(function (result) {
					resolve(result);
				}).catch(function (err) {
					throw err;
				});
			});
		}).then(function (createdComment) {
			// Insert to comment cache
			var newCommentCache_Fields = {
				lastest: []
			};
			var dataCreatedComment = { //init form(like old form) and data
				cid: createdComment.cid,
				uid: createdComment.uid,
				uname: createdComment.uname,
				content: createdComment.content,
				created: createdComment.created,
				changed: createdComment.changed,
				status: (createdComment.status == 1) ? true : false,
				promoted: false,
				replyTo: parseInt(createdComment.reply_to),
				host: createdComment.host,
				guid: 0,
				__isset_bit_vector: [1, 1, 1, 1, 1, 1, 1, 1],
				optionals: ["CID"]
			}
			flag_join.join = createdComment.cid;
			
			return new Promise(function (resolve, reject) {
				if(createdComment.reply_to == 0) {
					// If it is newly comment then no comment reply to it
					newCommentCache_Fields.guid    = createdComment.cid;
					newCommentCache_Fields.count   = 0;
					newCommentCache_Fields.lastest.push(dataCreatedComment);
					newCommentCache_Fields.lastest = JSON.stringify(newCommentCache_Fields.lastest);
					// console.log(newCommentCache_Fields);
					Comment_cache.create(newCommentCache_Fields).then(function (result) {
						response.message.push("Comment id " + createdComment.cid + " was added by " + createdComment.uname);
						response.data[0].comment_id = createdComment.cid;
						response.data[0].user       = createdComment.uid + "__" + createdComment.uname;
						response.data[0].content    = createdComment.content;
						resolve(result);
					}).catch(function (err) {
						throw err;
					});
				}
				else {
					Comment_cache.findOne({guid: createdComment.reply_to}).then(function (existCache) {
						if(typeof existCache != "undefined") {
							newCommentCache_Fields.count = parseInt(existCache.count) + 1;

							var lastestCache = JSON.parse(existCache.lastest);
							if(lastestCache.length < 3) {
								lastestCache.push(dataCreatedComment);
								newCommentCache_Fields.lastest = JSON.stringify(lastestCache);
							} 
							else if(lastestCache.length == 3) {
								lastestCache.splice(1,1);
								lastestCache.push(dataCreatedComment);
								newCommentCache_Fields.lastest = JSON.stringify(lastestCache);
							}

							Comment_cache.update({guid: createdComment.reply_to}, newCommentCache_Fields).then(function (dataCreatedComment) {	
								response.message.push("Comment id " + createdComment.cid + " added by " + createdComment.uname);
								response.data[0].comment_id = createdComment.cid;
								response.data[0].user = createdComment.uid + "__" + createdComment.uname;
								response.data[0].content = createdComment.content;
								resolve(dataCreatedComment);
							}).catch(function (err) {
								throw err;
							});
						} else {
							throw "Undefined cache comment";
						}
					}).catch(function (err) {
						throw err;
					});
				}
			});
		}).then(function (createdCommentCache) {
			console.log(flag_join);
			if(flag_join.col == "news") {
				News_comment.create({cid: flag_join.join, nid: parseInt(flag_join.val)}).then(function (success) {
					return Promise.resolve(1);
				}).catch(function (err) {
					throw err;
				});
			}
			else if(flag_join.col == "game") {
				Game_comment.create({cid: flag_join.join, aid: parseInt(flag_join.val)}).then(function (success) {
					return Promise.resolve(1);
				}).catch(function (err) {
					throw err;
				});
			}
			response.message.push("Cache was changed");
			response.data[0].commentcache_id = createdCommentCache.guid;
			response.data[0].commentcache_latest = createdCommentCache.lastest;
		}).then(function (successful) {
			response.status = 1;
			response.message.push("Table join has been created");
			return res.json(response);
		}).catch(function (err) {
			response.message.push(err);
			return res.json(response);
		});
	},
	update: function (req, res) {
		var response = {
			status:  0,
			message: [],
			data:    [{}]
		}
		var fields = {};

		if(req.method != "POST") {
			response.message.push("Bad request. Return 400 !");
			return res.json(400, response);
		}

		// params: cid, new content, uid
		var comment = req.validate({"cid": "numeric"}, false);
		if(!comment) {
			response.message = "Comment is required!";
			return res.json(400, response);
		}

		var params = req.validate([
			{"content": "string"}, 
			{"uid": "numeric"}
		], false);
		if(!params) {
			response.message = "Invalid params";
			return res.json(400, response);
		}

		var promiseUpdateComment = new Promise(function (resolve, reject) {
			Comment_new.findOne({
				cid: comment.cid,
				uid: params.uid
			}).then(function (foundComment) {
				if(typeof foundComment != "undefined") {
					let newFields = {};
					newFields.changed = Math.floor((new Date()).getTime()/1000);
					newFields.content = htmlEntities.endcode(params.content);

					Comment_new.update({cid: comment.cid}, newFields).then(function (wasUpdated) {
						resolve(wasUpdated);
					}).catch(function (err) {
						reject("Update comment's content failed");
					});
				}
				else {
					throw "Undefined comment";
				}
			}).catch(function (err) {
				throw err;
			});
		});
		promiseUpdateComment.then(function (wasUpdated) {
			response.message.push("Comment " + wasUpdated[0].cid + " was updated !");
			response.data[0].cid = wasUpdated[0].cid;
			response.data[0].new_cotent = wasUpdated[0].content;
			response.data[0].time = wasUpdated[0].changed;
			response.status = 1;

			return new Promise(function (resolve, reject) {
				var reply_to = parseInt(wasUpdated[0].reply_to);
				if(reply_to == 0) {
					// It is main comment.
					// Find comment_cache by cid not reply_to(cid = guid)
					let comment_id = parseInt(wasUpdated[0].cid);
					Comment_cache.findOne({
						guid: comment_id
					}).then(function (foundCache) {
						if(typeof foundCache != "undefined") {
							let lastestContent = JSON.parse(foundCache.lastest);
							lastestContent[0].content = wasUpdated[0].content;
							lastestContent[0].changed = wasUpdated[0].changed;

							Comment_cache.update({guid: comment_id}, {lastest: JSON.stringify(lastestContent)}).then(function (successful) {
								resolve(successful);
							}).catch(function (err) {
								throw err;
							});
						} else {
							throw "Undefined comment cache";
						}
					}).catch(function (err) {
						throw err;
					});
				}
				else {
					// reply_to = guid
					let reply_to = parseInt(wasUpdated[0].reply_to);
					Comment_cache.findOne({
						guid: reply_to
					}).then(function (foundCache) {
						if(typeof foundCache != "undefined") {
							let lastestContent = JSON.parse(foundCache.lastest);
							lastestContent.forEach(function (eachOne) {
								if(eachOne.cid == wasUpdated[0].cid) {
									eachOne.changed = wasUpdated[0].changed;
									eachOne.content = wasUpdated[0].content;
								}
							});
							Comment_cache.update({guid: reply_to}, {lastest: JSON.stringify(lastestContent)}).then(function (successful) {
								resolve(successful);
							}).catch(function (err) {
								throw err;
							});
						}
						else {
							throw "Undefined comment cache";
						}
					}).catch(function (err) {
						throw "Comment cache not found";
					});
				}
			});
		}).then(function (wasUpdatedCache) {
			response.message.push("Comment Cache " + wasUpdatedCache[0].guid + " was updated !");
			response.data[0].comment_cache = wasUpdatedCache[0].guid;
			response.data[0].new_cache = wasUpdatedCache[0].lastest;
			return res.json(response);
		}).catch(function (err) {
			response.message.push(err);
			return res.json(response);
		});
	},
	test: function (req, res) {
		Comment_new.findOne({
			cid: 4200,
			uid: 10583827
		}).exec(function (err, result) {
			if(err) throw err;
			console.log(result);
		})
	},

	list: function (req, res) {
		var response = {
			status: 0,
			messages: []
		};
		var checkPage = validator.isInt(req.param("page"), { min: 1, max: 99 });
		var getCommentsList = new Promise(function(resolve, reject) {
			if (checkPage != true) {
					response.messages.push("Page is not integer or greater than 0");
					reject(1);
					return;
				}
				var filter = {};
				if (req.query.filter.hasOwnProperty("nid")) {
					filter.nid = req.query.filter.nid;
				} else if (req.query.filter.hasOwnProperty("aid")) {
					filter.aid = req.query.filter.aid;
				} else {
					response.messages.push("nid or aid is missing.");
				}
				filter.reply_to = 0;
				filter.status = 1;
				
				if (!req.query.page) {
					req.query.page = 1;
				}
				Comment_new.getComment(filter, {order: "changed DESC", limit: 10, page: req.query.page}, function(error, result) {
					if (error) {
						reject(error);
						return;
					}
					resolve(result);
				});
		});
		var sendJson = function () {
			getCommentsList.then(function (comments) {
				var commentIdList = [];
				response.items = comments;
				for (var i = 0; i < comments.length; i++) {
					if (commentIdList.indexOf(comments[i].cid) < 0) {
						commentIdList.push(comments[i].cid);
					}
					response.items[i].subcomments = [];
					response.items[i].created = TimeService.readableTime(comments[i].created);
					response.items[i].content = htmlEntities.decode(comments[i].content);
				}
				if (commentIdList.length == 0) {
					response.status = 1;
					res.json(response);
					return;
				}
				Comment_new.getComment({reply_to: commentIdList, status: 1}, {}, function(error, result) {
					if (error) {
						reject(error);
						return;
					}
					for (var m = 0; m < result.length; m++) {
						result[m].created = TimeService.readableTime(result[m].created);
						result[m].content = htmlEntities.decode(result[m].content);
						result[m].nid = req.query.filter.nid ? req.query.filter.nid : req.query.filter.aid;
						result[m].username = result[m].uname;
						var index = response.items.findIndex(function(element) {
							if (element.cid == result[m].reply_to) {
								return true;
							}
							return false;
						});
						response.items[index].subcomments.push(result[m]);
					}
					response.status = 1;
					res.json(response);
				});
			})
			.catch(function (error) {
				if (error && error.hasOwnProperty("code")) {
					return next(error);
				}
				res.json(response);
			});
		};

		sendJson();
	},
};

