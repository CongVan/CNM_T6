var connector = require('../connector/db-connector');
var config = require('../config');
exports.GetRequests = () => {
    return new Promise((resolve, reject) => {
        var connection = connector.getConnection();
        connection.connect();
        var sql = `
        select id,customer_name,customer_phone,customer_address,
        note,DATE_FORMAT(create_date,'%d-%m-%Y %k:%i') create_date,location_1,location_2  ,confirm_status
        from request where confirm_status=1 
        order by create_date desc`;
        // console.log(sql);
        connection.query(sql, (error, results, fields) => {

            if (error)
                reject(error);
            else resolve(results);
            connection.end();
        });
    });
}