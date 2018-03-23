/**
 * Comment_new.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'mysqlThapThanhCoreDev',
  tableName: 'comment_new',
  tamtayIdsDbName: 'tamtay_ids',
  attributes: {
  	cid: {
  		type: "integer",
  		primaryKey: true,
  		autoIncrement: true,
  		unique: true
  	},
  	uid: {
  		type: "integer",
  		required: false,
  		defaultsTo: null
  	},
  	created: {
  		type: "integer",
  		required: false,
  		defaultsTo: null
  	},
  	content: {
  		type: "text",
  		required: false,
  		defaultsTo: null
  	},
  	host: {
  		type: "integer",
  		required: false,
  		defaultsTo: null
  	},
  	status: {
  		type: "integer",
  		size: 1,
  		required: false,
  		defaultsTo: null
  	},
  	promoted: {
  		type: "integer",
  		size: 1,
  		required: true,
  		defaultsTo: null
  	},
  	uname: {
  		type: "string",
  		size: 200,
  		required: false,
  		defaultsTo: null
  	},
  	changed: {
  		type: "integer",
  		required: false,
  		defaultsTo: null
  	},
  	reply_to: {
  		type: "integer",
  		required: true,
  	}
  },
  find: function(filter, options, callback) {
        var app = this;
        var condition = "";
        var bind = [];
        for (prop in filter) {
          if (filter[prop] instanceof Array) {
            if (filter[prop].length > 0) {
              condition += " AND `" + prop + "` IN (" + filter[prop].join(',') + ")";
            }
          } else {
            if (prop == "cid") {
              condition += " AND `"+this.tableName+"`.`" + prop + "`=?";
            } else {
              condition += " AND `" + prop + "`=?";
            }
            bind.push(filter[prop]);
          }
        }
        condition = condition.substr(5);
        
        var optionsString = "";
        if (options) {
          if (options.order) {
            optionsString += " ORDER BY " + options.order;
          }
          if (options.limit) {
            optionsString += " LIMIT " + (options.limit + 1);
          }
          if (options.page) {
            optionsString += " OFFSET " + (options.limit*(options.page - 1));
          }
        }
        var sql = "SELECT * FROM `"+this.tableName+"` WHERE " + condition + optionsString;
        if (filter.hasOwnProperty("nid")) {
          sql = "SELECT `"+this.tableName+"`.*, `news_comment`.nid FROM `"+this.tableName+"` LEFT JOIN `news_comment` ON `"+this.tableName+"`.cid = `news_comment`.cid WHERE " + condition + optionsString;
        } else if (filter.hasOwnProperty("aid")) {
          sql = "SELECT `"+this.tableName+"`.*, `game_comment`.aid, `game_comment`.type FROM `"+this.tableName+"` LEFT JOIN `game_comment` ON `"+this.tableName+"`.cid = `game_comment`.cid WHERE " + condition + optionsString;
        }

        var promise = new Promise(function(resolve, reject) {
          MemcachedService.queryCache(Comment_new, ''+sql, bind, function(error, result) {
            if (error) {
              reject(error);
              return;
            }
            if (result.length > 0) {
              resolve(result);
            } else {
              callback(null, []);
            }
          });
        });
        promise.then(function(success) {
          return new Promise(function(resolve, reject) {
            var comments = success;
            var userIdList = [];
            for (var i = 0; i < comments.length; i++) {
              userIdList.push(comments[i].uid);
            }
            var userIdListStr = "(" + userIdList.join() + ")";
            MemcachedService.queryCache(Comment_new, "SELECT uid, name FROM users WHERE uid IN " + userIdListStr, [], function(error, result) {
              if (error) {
                reject(error);
                return;
              }
              var tmp = [];
              for (var m = 0; m < result.length; m++) {
                tmp[result[m].uid] = result[m].name;
              }
              for (var n = 0; n < comments.length; n++) {
                comments[n].username = tmp[comments[n].uid];
              }
              callback(null, comments);
            });
          });
        }).catch(function(error) {
          callback(error, []);
        });
    },
};

