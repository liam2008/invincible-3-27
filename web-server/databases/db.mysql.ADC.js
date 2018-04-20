var env = process.env.NODE_ENV || 'development';
var config = require('../config/db.mysql.ADC.json')[env];
var mysql = require('mysql');
var pool = mysql.createPool(config);

module.exports = {
	query: function(sql, callback) {
		pool.getConnection(function(err, connection) {
			if(err) {
				console.error(err)
				callback(err, null)
			};
			connection.query(sql, function(error, results, fields) {
				connection.release();
				if(error) console.error(error);
				callback(error, results)
			})
		})
	}
};