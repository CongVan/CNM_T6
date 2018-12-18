var express = require('express');
var router = express.Router();
var driverModel = require('../models/driver');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({status:'oK'})
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
              msg: ""+err
          });
      });
});
module.exports = router;