var Memcached = require('memcached');
var memcached = new Memcached(''+sails.config.connections.memcached.host+":"+sails.config.connections.memcached.port);
var crypto = require('crypto');

module.exports = {
	queryCache: function(model, sql, bind, callback, cacheTimeout = 02) {
		var queryHash = crypto.createHash('sha512').update(sql+bind).digest("hex");
		
		memcached.get(queryHash, function (err, data) {
			if (err) throw err;
			
			if (!data) {
				model.query(sql, bind, function(err, rows) {
					if (err) throw err;	

					memcached.set(queryHash, rows, cacheTimeout, function(err) {
						if (err) throw err;
					});
					
					callback(err, rows);
				});				
			} else {
				callback(null, data);
			}		
		});
	}
};