var mysql  = require('mysql');

function createDBConnection(){
        return mysql.createConnection({
            host: 'https://desolate-everglades-91879.herokuapp.com/',
            user: 'b81ebd48c178a4',
            password: '76bfaa29',
            database: 'payfast'
        });
}

module.exports = function() {
    return createDBConnection;
}
