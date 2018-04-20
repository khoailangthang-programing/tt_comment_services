
module.exports = {
  connection: 'mysqlThapThanhIdsPro',
	tableName: 'sessions',
  attributes: {
  	uid: {
  		type: "integer",
  		primaryKey: true,
  		required: true
  	},
  	name: {
  		type: "string",
  		size: 60,
  		required: true
  	},
  	sid: {
  		type: "integer",
  		required: true
  	},
  	hostname: {
  		type: "string",
  		size: 128,
  		required: true
  	},
  	timestamp: {
  		type: "integer",
  		required: true,
  		defaultsTo: 0
  	},
  	session: {
  		type: "text",
  		required: true
  	}

  }
};

