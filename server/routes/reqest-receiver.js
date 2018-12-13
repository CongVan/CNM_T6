var express = require('express');
var router = express.Router();
var reqModel = require('../models/request');
var config = require('../config');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({status:'oK'})
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
module.exports = router;