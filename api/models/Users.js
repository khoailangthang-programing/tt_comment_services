/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'mysqlTamTayIdsDev',
  attributes: {
  	uid: {
      type: "integer",
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    name: {
      type: "string",
      required: false
    },
    pass: {
      type: "string",
      required: false
    },
    mail: {
      type: "string",
      required: false
    },
    mode: {
      type: "integer",
      required: false,
      defaultsTo: null
    },
    sort: {
      type: "integer",
      required: false,
      defaultsTo: null
    },
    threshold: {
      type: "integer",
      required: true,
      defaultsTo: null
    },
    theme: {
      type: "string",
      required: false,
      defaultsTo: null
    },
    signature: {
      type: "string",
      required: false,
      defaultsTo: null
    }
    //dai qua a oi
  }
};

