
var connector = require('../connector/db-connector');
var distance = require('google-distance-matrix');
var config = require('../config');
distance.key(config.keyMap);
exports.Login = (driver) => {
    return new Promise((resolve, reject) => {
        var connection = connector.getConnection();
        connection.connect();
        var sql = `
        select *
        from driver where user_name='${driver.user_name}' and password='${driver.password}'`;
        // console.log(sql);
        connection.query(sql, (error, results, fields) => {

            if (error)
                reject(error);
            else resolve(results);
            connection.end();
        });
    });
}

exports.getDriver = (id) => {
    return new Promise((resolve, reject) => {
        var connection = connector.getConnection();
        connection.connect();
        var sql = `
        select *
        from driver where id=${id}`;
        // console.log(sql);
        connection.query(sql, (error, results, fields) => {

            if (error)
                reject(error);
            else resolve(results);
            connection.end();
        });
    });
}
exports.getDriverOnline = (lstUserNotConfirm) => {
    return new Promise((resolve, reject) => {
        var connection = connector.getConnection();
        connection.connect();
        var qUserNot = "";
        if (lstUserNotConfirm.length > 0) {
            qUserNot = ` AND id NOT IN (${lstUserNotConfirm.join(',')})`;
        }
        var sql = 'SELECT * FROM driver WHERE status=1 ' + qUserNot;
        //  console.log(sql);
        connection.query(sql, (error, results) => {

            if (error)
                reject(error);
            else {
                console.log(results);
                resolve(results)

            };
            connection.end();
        });
    });
}
exports.checkStatusConfirm = (requestId, userId) => {
    return new Promise((resolve, reject) => {
        var connection = connector.getConnection();
        connection.connect();
        var sql = `SELECT * FROM driver_request WHERE request_id='${requestId}' AND driver_id='${userId}'`;
        //  console.log(sql);
        connection.query(sql, (error, results) => {
            if (error)
                reject(error);
            else if (results.length > 0) {
                resolve(true);
            } else {
                resolve(false)
            }
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
        SET status='${driver.status}', location='${driver.location}' 
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
exports.offline = (driver) => {
    return new Promise((resolve, reject) => {
        var connection = connector.getConnection();
        connection.connect();
        var sql = `
        UPDATE driver
        SET status='${driver.status}'
        where id=${driver.id}`;
        // console.log(sql);
        connection.query(sql, (error, results) => {

            if (error)
                reject(error);
            else resolve(results);
            connection.end();
        });
    });
}
exports.updateLocation = (driver) => {
    return new Promise((resolve, reject) => {
        var connection = connector.getConnection();
        connection.connect();
        var sql = `
        UPDATE driver
        SET location='${driver.location}'
        where id=${driver.id}`;
        // console.log(sql);
        connection.query(sql, (error, results) => {

            if (error)
                reject(error);
            else resolve(results);
            connection.end();
        });
    });
}
exports.updateRefreshToken = (driver) => {
    return new Promise((resolve, reject) => {
        var connection = connector.getConnection();
        connection.connect();
        var sql = `
        UPDATE driver
        SET refreshToken='${driver.refreshToken}'
        where id=${driver.id}`;
        // console.log(sql);
        connection.query(sql, (error, results) => {

            if (error)
                reject(error);
            else resolve(results);
            connection.end();
        });
    });
}
exports.checkRefreshToken = (rToken, ) => {
    return new Promise((resolve, reject) => {
        var connection = connector.getConnection();
        connection.connect();
        var sql = `SELECT * FROM driver WHERE refreshToken='${rToken}' `;
        // console.log(sql);
        connection.query(sql, (error, results) => {
            if (error)
                reject(error);
            else {
                resolve(results)
            }
            connection.end();
        });
    });
}

exports.getNearest = (locationRequest) => {
    // console.log(locationRequest);
    return new Promise((res, rej) => {
        this.getDriverOnline()
            .then(drivers => {
                var origin = [`${locationRequest.lat},${locationRequest.lng}`];
                var destinations = [];
                drivers.forEach(d => {
                    var des = `${JSON.parse(d.location).lat},${JSON.parse(d.location).lng}`;
                    destinations.push(des);
                });
                distance.matrix(origins, destinations, function (err, distances) {
                    if (err) {
                        res({
                            result: -1,
                            msg: err,
                        })
                    }
                    if (distances == null || distances === undefined) {
                        res({
                            result: -1,
                            msg: "Không thể kết nối google map",
                        });
                    }
                    try {
                        if (distances.status == 'OK') {
                            if (distances.rows[0].elements.length > 0) {
                                res.json({
                                    status: 1,
                                    data: distances.rows[0]
                                })
                            } else {
                                res({
                                    result: -1,
                                    msg: "Không tìm thấy đường đi",
                                });
                            }
                        }
                    } catch (error) {
                        rej({
                            result: -1,
                            msg: "" + error
                        })
                    }
                });

            }).catch(err => {

            })
    });
}