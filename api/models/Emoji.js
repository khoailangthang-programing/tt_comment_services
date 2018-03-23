/**
 * Emoji.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'mysqlThapThanhCoreDev',
  tableName: 'emoji',
  attributes: {
  	eid: {
      type: "integer",
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    code: {
      type: "string",
      required: false
    },
    data: {
      type: "text",
      required: false
    }
  },
  getEmoji : function(filter, options, callback) {
    var condition = "";
    var bind = [];
    for (prop in filter) {
      condition += " AND `" + prop + "`=?";
      bind.push(filter[prop]);
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
    var sql = "SELECT * FROM `"+this.tableName+"` WHERE 1 " + condition + optionsString;
    MemcachedService.queryCache(Emoji,''+sql, bind, callback)
  }
};

