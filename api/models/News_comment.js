/**
 * News_comment.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'mysqlThapThanhCoreDev',
	tableName: 'news_comment',
  attributes: {
  	cid: {
  		type: "integer",
  		size: 64,
  		required: true
  	},
  	nid: {
  		type: "integer",
  		required: true
  	}
  }
};

