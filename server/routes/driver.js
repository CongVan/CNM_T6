var express = require('express');
var router = express.Router();
var driverModel = require('../models/driver');
var jwt = require('jsonwebtoken');
var config = require('../config');
var token = require('../oauth');
var randtoken = require('rand-token');
var clientDB = require('../models/clientDB');
var io=require('../socketIO');
/* GET home page. */
router.get('/', function (req, res, next) {
    res.json({ status: 'oK' })
});

var verifyAccessToken = (req, res, next) => {
    // console.log(req.headers);
    // if(req.Url.pathname=='/driver/login'){
    //   next();
    // }
    var token = req.headers["x-access-token"];
    if (token) {
        jwt.verify(token, config.secret, (err, payload) => {
            if (err) {
                // res.statusCode = 403;
                res.json({
                    result: -99,
                    msg: "Invalid Token",
                    err: err
                });
            } else {
                console.log(payload);
                req.payload = payload;
                next();
            }
        });
    } else {
        res.statusCode = 403;
        res.json({
            result: -99,
            msg: "Không có token"
        });
    }
}
router.get('/valid-token' ,function (req, res, next) {
   
    var token = req.headers["x-access-token"];
    var rtoken = req.headers["x-refresh-token"];
      console.log(token,' == ///// ',rtoken);
    if (token) {
        jwt.verify(token, config.secret, (err, payload) => {
            if (err) {
                // res.statusCode = 403;
                if(rtoken){
                    driverModel.checkRefreshToken(rtoken)
                    .then(results=>{
                        if(results.length>0){
                            var pl = {
                                data: results[0]
                            };
                            var token = jwt.sign(pl, config.secret, { expiresIn: config.expiredJWT });
                            // req.newToken = token;
                            // console.log('check' ,results);
                            //  var socketId=clientDB.getClientByUserId(results[0].id);
                            //  console.log(socketId, results[0].id);
                            
                            // io.sockets.connected[socketId].emit('refreshToken', {token:token});
                            res.json({
                                status:1,
                                msg:"OK",
                                jwt:token
                            })
                        }else{
                            res.json({
                                result:-99,
                                msg: "Invalid Token",
                                err: err
                            });
                        }
                    })
                    .catch(err=>{
                        res.json({
                            result:-99,
                            msg: `${err}`,
                        });
                    })
                }else{
                    res.json({
                        result:-99,
                        msg: "Invalid Token",
                        err: err
                    });
                }
            } else {
                // console.log(payload);
                req.payload = payload;
                res.json({
                    status:1,
                    msg:"OK"
                })
            }
        });
    } else {
        res.statusCode = 403;
        res.json({
            result:-99,
            msg: "Không có token"
        });
    }
    // var token = req.headers["x-access-token"];
    // if (token) {
    //     jwt.verify(token, config.secret, (err, payload) => {
    //         if (err) {
    //             res.statusCode = 204;
    //             res.json({
    //                 status: -99,
    //                 msg: "Invalid Token",
    //                 err: err
    //             });
    //         } else {
    //             res.statusCode = 200;
    //             res.json({
    //                 status: 1,
    //                 msg: "OK",
    //             })
    //         }
    //     });
    // } else {
    //     res.statusCode = 204;
    //     res.json({
    //         status: -99,
    //         msg: "Token Not Found",
    //         err: "Token Not Found"
    //     });
    // }
});
router.post('/login', function (req, res, next) {
    var d = req.body;
    driverModel.Login(d)
        .then(results => {
            // console.log(results);
            if (results.length > 0) {
                var payloadRefresh = {
                    data: results[0]
                }
                // console.log(payload);
                var refreshToken = randtoken.generate(16);
                // jwt.sign(payloadRefresh,config.secretRefresh+`${results[0].id}`, { expiresIn: config.expiredRefreshToken });
                driverModel.updateRefreshToken({ refreshToken: refreshToken, id: results[0].id });
                driverModel.getDriver(results[0].id)
                    .then(data => {
                        var payload = {
                            data: data[0]
                        };
                        // console.log(data);
                        var token = jwt.sign(payload, config.secret, { expiresIn: config.expiredJWT });

                        res.status(200)
                            .json({
                                auth: true,
                                user: data[0],
                                token: token,
                                refreshToken: refreshToken
                            });
                    })

            } else {
                res.status(200)
                    .json({
                        auth: false
                    });
            }
        })
        .catch(error => {
            res.status(500)
                .json({ msg: 'login error: ' + error })
            console.log('login', error);
        });
});
router.get('/get-online',token.verifyAccessToken, function (req, res, next) {
    driverModel.getDriverOnline()
        .then(rows => {
            res.json({ result: 1, data: rows });
        })
        .catch(err => {
            res.json({ result: -1, msg: err });
        })
});
router.post('/online', token.verifyAccessToken, (req, res) => {
    var d = req.body;

    driverModel.online(d)
        .then(results => {
            var r = results.affectedRows;
            if (r == 1) {
                res.json({
                    result: 1,
                    msg: "ONLINE thành công"
                });
            } else {
                res.json({
                    result: -1,
                    msg: "ONLINE thất bại"
                });
            }
        })
        .catch(err => {
            res.json({
                result: -1,
                msg: "" + err
            });
        });
});

router.post('/offline',token.verifyAccessToken, (req, res) => {
    var d = req.body;
    driverModel.offline(d)
        .then(results => {
            var r = results.affectedRows;
            if (r == 1) {
                res.json({
                    result: 1,
                    msg: "OFFLINE thành công"
                });
            } else {
                res.json({
                    result: -1,
                    msg: "OFFLINE Thất bại"
                });
            }
        })
        .catch(err => {
            res.json({
                result: -1,
                msg: err
            });
        });
});
router.post('/update-location',token.verifyAccessToken, (req, res) => {
    var d = req.body;
    driverModel.updateLocation(d)
        .then(results => {
            var r = results.affectedRows;
            if (r == 1) {
                res.json({
                    result: 1,
                    msg: "Cập nhật vị trí thành công"
                });
            } else {
                res.json({
                    result: -1,
                    msg: "Cập nhật vị trí t thất bại"
                });
            }
        })
        .catch(err => {
            res.json({
                result: -1,
                msg: err
            });
        });
});
router.get('/get-nearest',(req,res)=>{
    var locationRequest=req.query.locationRequest;
    console.log(locationRequest);
    console.log(req.query);
    driverModel.getNearest(locationRequest)
    .then(results=>{
        res.json(results);
    }).catch(err=>{
        res.json({
            result: -1,
            msg: err
        });
    })
});


module.exports = router;