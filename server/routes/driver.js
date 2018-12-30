var express = require('express');
var router = express.Router();
var driverModel = require('../models/driver');
var jwt = require('jsonwebtoken');
var config = require('../config');
var token=require('../oauth');
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
                    result:-99,
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
            result:-99,
            msg: "Không có token"
        });
    }
}
router.get('/valid-token', function (req, res, next) {
    var token = req.headers["x-access-token"];
    if (token) {
        jwt.verify(token, config.secret, (err, payload) => {
            if (err) {
                res.statusCode = 204;
                res.json({
                    status: -99,
                    msg: "Invalid Token",
                    err: err
                });
            } else {
                res.statusCode = 200;
                res.json({
                    status: 1,
                    msg: "OK",
                })
            }
        });
    } else {
        res.statusCode = 204;
        res.json({
            status: -99,
            msg: "Token Not Found",
            err: "Token Not Found"
        });
    }
});
router.post('/login', function (req, res, next) {
    var d = req.body;
    driverModel.Login(d)
        .then(results => {
            // console.log(results);
            if (results.length > 0) {
                var payload = {
                    data: results[0]
                };
                console.log(payload);
                var token = jwt.sign(payload, config.secret, { expiresIn: config.expiredJWT });//800s
                res.status(200)
                    .json({
                        auth: true,
                        user: results[0],
                        token: token
                    });
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
router.get('/get-online', function (req, res, next) {
    driverModel.getDriverOnline()
        .then(rows => {
            res.json({ result: 1, data: rows });
        })
        .catch(err => {
            res.json({ result: -1, msg: err });
        })
});
router.post('/online',token.verifyAccessToken, (req, res) => {
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

router.post('/offline', (req, res) => {
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
router.post('/update-location', (req, res) => {
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



module.exports = router;