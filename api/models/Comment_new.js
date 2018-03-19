/**
 * Comment_new.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

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
  	},
  	comments: {
  		collection: "comment_new",
  		via: "comment"
  	},
  	comment: {
  		model: "comment_new"
  	},
  	users: {
  		model: "users"
  	}
  }
};

