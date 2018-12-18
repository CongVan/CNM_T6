const mysql=require('mysql');
exports.getConnection=()=>{
    var connection= mysql.createConnection({
        host:'localhost',
        port:'3306',
        user:'root',
        password:'root',    
        database:'gocar-db',
        multipleStatements:true
    });
    return connection;
}