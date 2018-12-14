var express = require('express');
var reqModel = require('../models/request');
var router = express.Router();
var appIo = null;
var config = require('../config');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({status:'oK'})
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
                msg: ""+err
            });
        });


});

module.exports = function (io) {
    appIo = io;

    return router;
}