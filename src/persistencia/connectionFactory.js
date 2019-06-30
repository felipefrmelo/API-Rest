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

const client = new Client({
    user: 'vlvnqdvjtxaalr',
    host: 'ec2-50-19-221-38.compute-1.amazonaws.com',
    database: 'deds8icromgoak',
    password: '689cac6991ae41223451f05ddd713ecc5587d17398badc9d88991655ee8fd8e7',
    port: 5432,
    ssl: true,
}
)

client.connect()



module.exports = function () {
        return () => client
    }