/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	uid: {
  		type: "integer",
  		primaryKey: true,
  		autoIncrement: false,
  		unique: true
  	},
  	name: {
  		type: "string",
  		required: true
  	},
  	email: {
  		type: "string",
  		size: 100,
  		required: true
  	},
  	avatar: {
  		type: "string",
  		required: false,
  		defaultsTo: null
  	},
  	created: {
  		type: "integer",
  		required: true,
  		defaultsTo: 0
  	},
  	comments: {
  		collection: "comment_new",
  		via: "users"
  	}
  }
};

