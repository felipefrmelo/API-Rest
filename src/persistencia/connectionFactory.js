var mysql  = require('mysql');

function createDBConnection(){
        return mysql.createConnection({
            host: 'localhost',
            user: 'admin',
            password: 'Fv123456@',
            database: 'payfast'
        });
}

module.exports = function() {
    return createDBConnection;
}
