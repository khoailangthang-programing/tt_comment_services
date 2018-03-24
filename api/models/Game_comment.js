/**
 * Game_comment.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	connection: 'mysqlThapThanhCoreDev',
	tableName: 'game_comment',
  attributes: {
  	cid: {
  		type: "integer",
  		required: true
  	},
  	aid: {
  		type: "integer",
  		required: true
  	},
  	type: {
  		type: "integer",
  		size: 4,
  		required: true
  	}
  }
};

