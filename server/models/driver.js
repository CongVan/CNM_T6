
var connector = require('../connector/db-connector');
exports.Login = (driver) => {
    return new Promise((resolve, reject) => {
        var connection = connector.getConnection();
        connection.connect();
        var sql = `
        select *
        from driver where user_name='${driver.user_name}' and password='${driver.password}'`;
        console.log(sql);
        connection.query(sql, (error, results, fields) => {

            if (error)
                reject(error);
            else resolve(results);
            connection.end();
        });
    });
}
exports.online = (driver) => {
    return new Promise((resolve, reject) => {
        var connection = connector.getConnection();
        connection.connect();
        var sql = `
        UPDATE driver
        SET status='${driver.stutus}', location='${driver.location}' 
        where id=${driver.id}`;
        console.log(sql);
        connection.query(sql, (error, results) => {

            if (error)
                reject(error);
            else resolve(results);
            connection.end();
        });
    });
}