module.exports.connections = {
  mysqlThapThanhCoreDev: {
    adapter: 'sails-mysql',
    host: '127.0.0.1',
    user: 'root', //optional
    password: '', //optional
    database: 'thapthanh_core' //optional
  },
  mysqlThapThanhCorePro: {
    adapter: 'sails-mysql',
    host: '127.0.0.1',
    user: 'root', //optional
    password: '', //optional
    database: 'thapthanh_core' //optional
  },
  mysqlThapThanhIdsDev: {
    adapter: 'sails-mysql',
    host: '127.0.0.1',
    user: 'root', //optional
    password: '', //optional
    database: 'thapthanh_ids' //optional
  },
  mysqlThapThanhIdsPro: {
    adapter: 'sails-mysql',
    host: '127.0.0.1',
    user: 'root', //optional
    password: '', //optional
    database: 'thapthanh_ids' //optional
  },
  mysqlTamTayIdsDev: {
    adapter: 'sails-mysql',
    host: '127.0.0.1',
    user: 'root', //optional
    password: '', //optional
    database: 'tamtay_ids' //optional
  },
  mysqlTamTayIdsPro: {
    adapter: 'sails-mysql',
    host: '127.0.0.1',
    user: 'root', //optional
    password: '', //optional
    database: 'tamtay_ids' //optional
  },

  memcachedDev: {
    host: 'localhost',
    port: '11211'
  },

  memcachedPro: {
    host: 'localhost',
    port: '11211'
  }
};
