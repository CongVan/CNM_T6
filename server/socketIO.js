var socket_io = require("socket.io");
var io = socket_io();
var config = require('./config');
var driver = require('./models/driver');
var clientDB = require('./models/clientDB');
var distance = require('google-distance-matrix');
var config = require('./config');
distance.key(config.keyMap);
io.on('connection', function (socket) {
    // socket.on('disconnect', function () {

    //     clientDB.removeClient(socket.id);
    //     console.log(clientDB.getAllClient());
    //   });
    // console.log("REQUEST_RECEIVER client connected");
    socket.on('JoinRoom', client => {
        // console.log(socket);
        socket.userId = client.user;
        socket.join(client.room);
        console.log("SERVER: " + client.room + " đã kết nối " + socket.id);
        io.to(client.room).emit('joinRoom', client.room + " đã kết nối " + socket.id);
        // if (client.room == config.roomDriver) {
        //     clientDB.addClient({ userId: client.user, socketId: socket.id });
        // }
        clientDB.addClient({ userId: client.user, socketId: socket.id });
        console.log(clientDB.getAllClient());
    });
    socket.on('SendingRequest', data => {
        //  console.log('SendingRequest',data);
        sendingRequest(data);
    });
});
var sendingRequest = (req) => {
    // return new Promise((res, rej) => {
    var reqNumber = parseInt(config.reqNumber);
    // console.log(`reqNu bmber`,reqNumber);
    var count = 0;
    var fn = setInterval(async () => {
        count++;
        var range = config.minRange + count * config.stepRange;//meter
        var lstUserNotConfirm = [];
        console.log('gọi tìm tài xế: ' + count, reqNumber, count < reqNumber);
        findDriver(req, range, lstUserNotConfirm)
            .then(results => {
                // var r = results.affectedRows;
                console.log('Kết quả tìm tài xế', results);
                if (results.result == 1) {
                    clearInterval(fn);
                    console.log(results.data);
                } else {
                    if (count <= reqNumber) {
                        // setInterval(fn, count * 1000);
                        if (results.userNotConfirm) {
                            lstUserNotConfirm.push(userNotConfirm);
                        }
                    } else {
                        clearInterval(fn);
                        console.log(results);
                    }
                    // return;
                }
            })
            .catch(err => {
                clearInterval(fn);
                console.log({
                    result: -1,
                    msg: err
                });
            });

    }, count * 1000 + 2000);//delay 5s
    // setInterval(fn,1000);

    // });
}
var findDriver = async (req, range, lstUserNotConfirm) => {
    return await new Promise((res, rej) => {
        console.log(req);
        if (req != null) {
            driver.getDriverOnline(lstUserNotConfirm)
                .then(drivers => {
                    console.log('getDriverOnline', drivers.length);
                    if (drivers.length > 0) {
                        var origin = req.location_1 ? JSON.parse(req.location_1) : JSON.parse(req.location_2);
                        console.log('REQUEST', req);
                        var origins = [`${origin.lat},${origin.lng}`];
                        // console.log(origins);
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
                            // console.log(distances);
                            try {
                                if (distances.status == 'OK') {
                                    if (distances.rows[0].elements.length > 0) {
                                        var min = 0;
                                        for (var i = 1; i < distances.rows[0].elements.length; i++) {
                                            var d = distances.rows[0].elements[i].distance.value;
                                            if (d < distances.rows[0].elements[min].distance.value && d <= range) {
                                                min = i;
                                            }
                                        }
                                        if (distances.rows[0].elements[min].distance.value > range) {
                                            res({
                                                result: -1,
                                                msg: "Không tìm thấy tài xế trong khoảng cách " + range,
                                            });

                                        }
                                        var ret = {
                                            result: 1,
                                            data: {
                                                min: distances.rows[0].elements[min].distance.value,
                                                driver: drivers[min].id,
                                                request: req
                                            },
                                            msg: "OK",
                                            // clients: io.sockets.adapter.rooms['Driver'].sockets,

                                        }
                                        var driverSocketId = clientDB.getClientByUserId(drivers[min].id);
                                        console.log('id find driver', driverSocketId, ' id driver', drivers[min].id);
                                        if (driverSocketId) {
                                            var i = 1;
                                            // var time = setTimeout(() => {
                                            io.sockets.connected[driverSocketId].emit('ReceiverRequest', ret);
                                            console.log('timeout', 'gọi check confirm');

                                            var time = setTimeout(() => {
                                                driver.checkStatusConfirm(req.id, drivers[min].id)
                                                    .then((check) => {
                                                        console.log('check', check);
                                                        clearTimeout(time);
                                                        if (check == true) {
                                                            res(ret);
                                                        } else {
                                                            res({
                                                                result: -1,
                                                                msg: "Tài xế không xác nhận",
                                                            });
                                                        }
                                                    }).catch(err => {
                                                        // clearTimeout(time);
                                                        rej(err);
                                                    });
                                            }, 5000);
                                            // }, config.delayTime * 1000);

                                            // io.to(`${driverSocketId}`).emit('ReceiverRequest', ret, function(confirm) {
                                            //     setTimeout(() => { }, config.delayTime);
                                            //     console.log(confim);
                                            //     if (confirm) {
                                            //         res(ret);
                                            //     } else {
                                            //         res({
                                            //             result: -1,
                                            //             msg: "Không tìm thấy tài xế",
                                            //             userNotConfirm: drivers[min].id
                                            //         });
                                            //     }
                                            // });


                                        } else {
                                            res({
                                                result: -1,
                                                msg: "Không tìm thấy Socket của tài xế",
                                            });
                                        }
                                    } else {
                                        res({
                                            result: -1,
                                            data: null,
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
                    } else {
                        res({
                            result: -1,
                            msg: "Không tìm thấy tài xế 1",
                        })
                    }
                })
                .catch(err => {
                    res({ result: -1, msg: "Không tìm thấy tài xế: " + err });
                })
        } else {
            res({ result: -1, msg: "Không tìm thấy request" });
        }
    });
}
module.exports = io;  