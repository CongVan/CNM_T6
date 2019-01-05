var connector = require('../connector/db-connector');
var config = require('../config');
var moment = require('moment');

exports.checkExistsRequest = (addr) => {
    return new Promise((resolve, reject) => {
        var connection = connector.getConnection();
        connection.connect();
        var sqlCheck = `SELECT * FROM request WHERE customer_address LIKE '%${addr.trim()}%' AND location_1 IS NOT NULL`
        connection.query(sqlCheck, (error, results) => {
            if (error)
                reject(error);
            else resolve(results);
            connection.end();
        });
    });
}
exports.AddRequest = (m) => {
    return new Promise((resolve, reject) => {
        var connection = connector.getConnection();
        connection.connect();
        var sql = `
        INSERT INTO request (customer_name, customer_phone, customer_address,note,confirm_status,create_date,location_1,location_2) 
        VALUES ('${m.customer_name}', '${m.customer_phone}', '${m.customer_address}','${m.note}',${m.confirm_status},'${moment().format('YYYY-MM-DD hh:mm:ss')}'
        ,'${m.location_1?m.location_1:''}','${m.location_2?m.location_2:''}'
        )`;

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
        order by date(create_date) desc`;
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
exports.ConfirmLocationRequest = (m) => {
    return new Promise((resolve, reject) => {
        var connection = connector.getConnection();
        connection.connect();
        console.log(m);
        var sql = `
        UPDATE request
        SET confirm_status=2,location_1='${m.location_1}',location_2='${m.location_2}'
        where id=${m.id};`

        connection.query(sql, (error, results) => {
            if (error)
                reject(error);
            else resolve(results);
            connection.end();
        });

    });
}
exports.UpdateStatusRequest = (m) => {
    return new Promise((resolve, reject) => {
        var connection = connector.getConnection();
        connection.connect();
        var sql = `
        UPDATE request
        SET confirm_status=${m.status}
        where id=${m.requestId};`
        var time = " ";
        if (m.status === 4) {
            time = `,start_time='${moment().format('YYYY-MM-DD hh:mm:ss')}'`;
        }
        if (m.status === 5) {
            time = `,end_time='${moment().format('YYYY-MM-DD hh:mm:ss')}'`;
        }
        sql += `UPDATE driver_request
        SET status=${m.statusDriving} ${time}
        where driver_id=${m.userId} and request_id=${m.requestId};
        `
        connection.query(sql, (error, results) => {
            if (error)
                reject(error);
            else resolve(results);
            connection.end();
        });

    });
}
exports.ConfirmDriverRequest = (m) => {
    return new Promise((resolve, reject) => {
        var connection = connector.getConnection();
        connection.connect();
        var sql = `
        UPDATE request
        SET confirm_status=${m.status == true ? 3 : 2}
        where id=${m.requestId};

        UPDATE driver
        SET status=${m.status == true ? 2 : 1}
        where id=${m.driverId}; 
        `
        if (m.status == true) {
            sql += ` INSERT INTO driver_request (driver_id, request_id, date, status, direction) 
            VALUES (${m.driverId}, ${m.requestId}, '${moment().format('YYYY-MM-DD hh:mm:ss')}', 1,'${JSON.stringify(m.direction)}');`;
        }
        console.log('ConfirmDriverRequest');
        console.log(sql);
        // resolve(sql);
        connection.query(sql, (error, results) => {
            if (error)
                reject(error);
            else {
                // console.log(results);
                resolve(results);
            }
            connection.end();
        });

    });
}

exports.searchRequest = (phoneNumber) => {
    return new Promise((resolve, reject) => {
        var connection = connector.getConnection();
        connection.connect();
        var sql = `
        select id,customer_name,customer_phone,customer_address,
        note,DATE_FORMAT(create_date,'%d-%m-%Y %k:%i') create_date,location_1,location_2  ,confirm_status
        from request where customer_phone LIKE '%${phoneNumber}%'
        order by date(create_date) desc`;
        // console.log(sql);
        connection.query(sql, (error, results, fields) => {

            if (error)
                reject(error);
            else resolve(results);
            connection.end();
        });
    });
}