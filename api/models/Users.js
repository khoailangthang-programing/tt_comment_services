var conn = require('../../config/connections')
// var mysql = require('mysql')
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
    },
    created: {
      type: "integer",
      required: false,
      defaultsTo: null
    },
    access: {
      type: "integer",
      required: false,
      defaultsTo: null
    },
    online_time: {
      type: "integer",
      required: false,
      defaultsTo: null
    },
    login: {
      type: "integer",
      required: false,
      defaultsTo: null
    },
    status: {
      type: "integer",
      required: false,
      defaultsTo: null
    },
    timezone: {
      type: "string",
      required: false,
      defaultsTo: null
    },
    language: {
      type: "string",
      required: false,
      defaultsTo: null
    },
    picture: {
      type: "string",
      required: false,
      defaultsTo: null
    },
    init: {
      type: "string",
      required: false,
      defaultsTo: null
    },
    data: {
      type: "longtext",
      required: false,
      defaultsTo: null
    },
    user_password_change: {
      type: "longtext",
      required: false,
      defaultsTo: null
    },
    nopass: {
      type: "integer",
      required: false,
      defaultsTo: null
    },
    verify_status: {
      type: "integer",
      required: false,
      defaultsTo: null
    },
    last_login: {
      type: "integer",
      required: false,
      defaultsTo: null
    }
  },
  isUser: function(filter, cb) {
    var app = Users
    app.findOne(filter).then(function(result) {
      if(typeof result != "undefined") {
        cb(null, result)
      }
      else {
        cb("User not found", null)
      }
    }).catch(function (err) {
      cb(err, null)
    })

  }
};

