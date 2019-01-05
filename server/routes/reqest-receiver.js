var express = require('express');
var reqModel = require('../models/request');
var router = express.Router();
var appIo = null;
var config = require('../config');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.json({ status: 'oK' })
});

// module.exports = router;

router.post('/add-request', (req, res) => {
    var m = req.body;
    reqModel.AddRequest(m)
        .then(results => {
            var r = results.affectedRows;
            if (r == 1) {
                res.json({
                    result: 1,
                    msg: "Thành công"
                });
                reqModel.GetRequests().then(rows => {
                    appIo.to(config.roomAdmin).emit('refreshData', rows);
                });
                reqModel.GetAllRequests().then(rows => {
                    appIo.to(config.roomAdmin).emit('refreshAllData', rows);
                });
            } else {
                res.json({
                    result: -1,
                    msg: "Thất bại"
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

router.get('/get-requests', (req, res) => {
    reqModel.GetRequests().then(rows => {
        res.statusCode = 200;
        res.json(rows);
        // appIo.emit('messageTest',"Server gởi lại 123 123 1");
    }).catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.end('View error log on server console');
    });
});

router.get('/get-all-requests', (req, res) => {
    reqModel.GetAllRequests().then(rows => {
        res.statusCode = 200;
        res.json(rows);
    }).catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.end('View error log on server console');
    });
});
router.get('/search-request', (req, res) => {
    var phoneNumber = req.query.phoneNumber;
    reqModel.searchRequest(phoneNumber).then(rows => {
        res.statusCode = 200;
        res.json({ status: 1, requests: rows });
        // appIo.emit('messageTest',"Server gởi lại 123 123 1");
    }).catch(err => {
        // console.log(err);
        // res.statusCode = 500;
        res.json({ status: -1, err: err });
    });
});

router.get('/check-exsits-request', (req, res) => {
    var req = req.query.addr;
    reqModel.checkExistsRequest(req).then(rows => {
        res.statusCode = 200;
        res.json({ status: 1, requests: rows });
        // appIo.emit('messageTest',"Server gởi lại 123 123 1");
    }).catch(err => {
        // console.log(err);
        // res.statusCode = 500;
        res.json({ status: -1, err: err });
    });
});
router.post('/confirm-location-request', (req, res) => {
    var m = req.body;
    reqModel.ConfirmLocationRequest(m)
        .then(results => {
            var r = results.affectedRows;
            if (r == 1) {
                res.json({
                    result: 1,
                    msg: "Thành công"
                });
                reqModel.GetRequests().then(rows => {
                    appIo.to(config.roomAdmin).emit('refreshData', rows);
                });
                reqModel.GetAllRequests().then(rows => {
                    appIo.to(config.roomAdmin).emit('refreshAllData', rows);
                });
            } else {
                res.json({
                    result: -1,
                    msg: "Thất bại"
                });
            }

        })
        .catch(err => {
            rej.json({
                result: -1,
                msg: err
            });
        });


});

router.post('/update-status-request', (req, res) => {
    var m = req.body;
    reqModel.UpdateStatusRequest(m)
        .then(results => {
            var check = true;
            for (let index = 0; index < results.length; index++) {
                if (results[index].affectedRows == 0) {
                    check = false;
                    break;
                }
            }
            if (check) {
                res.json({
                    result: 1,
                    msg: "Thành công"
                });
                reqModel.GetAllRequests().then(rows => {
                    appIo.to(config.roomAdmin).emit('refreshAllData', rows);
                });
            } else {
                res.json({
                    result: -1,
                    msg: "Thất bại"
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
router.post('/confirm-driver-request', (req, res) => {
    var m = req.body;
    // console.log('/confirm-driver-request',m)
    reqModel.ConfirmDriverRequest(m)
        .then(results => {
            // res.json({a:resultsơ});
            var check = true;
            for (let index = 0; index < results.length; index++) {
                if (results[index].affectedRows == 0) {
                    check = false;
                    break;
                }
            }
            if (check) {
                res.json({
                    result: 1,
                    msg: "Thành công"
                });
                reqModel.GetAllRequests().then(rows => {
                    appIo.to(config.roomAdmin).emit('refreshAllData', rows);
                });
                // reqModel.GetRequests().then(rows => {
                //     appIo.emit('refreshData', rows);
                // });
            } else {
                res.json({
                    result: -1,
                    msg: "Thất bại",
                    results: results
                });
            }

        })
        .catch(err => {
            res.json({
                result: -1,
                msg: "Lỗi: " + err
            });
        });
});
module.exports = function (io) {
    appIo = io;

    return router;
}

