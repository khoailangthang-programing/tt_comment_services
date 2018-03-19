/**
 * Comment_cache.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	guid: {
  		type: "integer",
  		size: 64,
  		primaryKey: true,
  		autoIncrement: true,
  		unique: true
  	},
  	count: {
  		type: "integer",
  		required: true,
  		defaultsTo: 0
  	},
  	lastest: {
  		type: "text",
  		required: true
  	}
  }
};

