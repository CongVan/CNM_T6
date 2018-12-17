var connector = require('../connector/db-connector');
var config = require('../config');
var moment = require('moment');

exports.AddRequest = (m) => {
    return new Promise((resolve, reject) => {
        var connection = connector.getConnection();
        connection.connect();
        var sql = `
        INSERT INTO request (customer_name, customer_phone, customer_address,note,confirm_status,create_date) 
        VALUES ('${m.customer_name}', '${m.customer_phone}', '${m.customer_address}','${m.note}',1,'${moment().format('YYYY-MM-DD hh:mm:ss')}')`;

        connection.query(sql, (error, results) => {
            if (error)
                reject(error);
            else resolve(results);
            connection.end();
        });

    });
}

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

exports.GetAllRequests = () => {
    return new Promise((resolve, reject) => {
        var connection = connector.getConnection();
        connection.connect();
        var sql = `
        SELECT r.*,
        DATE_FORMAT(r.create_date,'%d-%m-%Y %k:%i') create_date,
        DATE_FORMAT(dr.date,'%d-%m-%Y %k:%i') driving_date,
        DATE_FORMAT(dr.start_time,'%d-%m-%Y %k:%i') start_time,
        DATE_FORMAT(dr.end_time,'%d-%m-%Y %k:%i') end_time,
        d.user_name,dr.direction
        FROM request r
        LEFT JOIN driver_request dr ON r.id=dr.request_id
        LEFT JOIN driver d ON dr.driver_id=d.id
        order by r.create_date desc`;

        // select id,customer_name,customer_phone,customer_address,
        // note,DATE_FORMAT(create_date,'%d-%m-%Y %k:%i') create_date,location_1,location_2  ,confirm_status
        // from request 
        // order by create_date desc
        //console.log(sql);
        connection.query(sql, (error, results, fields) => {
            if (error)
                reject(error);
            else resolve(results);
            connection.end();
        });
    });
}