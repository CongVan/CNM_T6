var express = require('express');
var router = express.Router();
var driverModel = require('../models/driver');
var jwt = require('jsonwebtoken');
var config = require('../config');
/* GET home page. */
router.get('/', function (req, res, next) {
    res.json({ status: 'oK' })
});


router.post('/online', (req, res) => {
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
module.exports = router;