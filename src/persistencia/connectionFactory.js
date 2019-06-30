// var mysql  = require('mysql');

// function createDBConnection(){
//         return mysql.createConnection({
//             host: 'localhost',
//             user: 'admin',
//             password: 'Fv123456@',
//             database: 'payfast'
//         });
// }

// module.exports = function() {
//     return createDBConnection;
// }
const { Client } = require('pg');


function createDBConnection(){
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    });    
    return client.connect();
}

module.exports = function() {
    return createDBConnection;
}