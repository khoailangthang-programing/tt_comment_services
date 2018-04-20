module.exports = {
  connection: 'mysqlThapThanhCorePro',
	tableName: 'news_comment',
  attributes: {
  	cid: {
  		type: "integer",
  		size: 64,
  		required: true
  	},
  	nid: {
  		type: "integer",
      primaryKey: true,
  		required: true
  	}
  }
};

