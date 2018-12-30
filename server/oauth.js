var jwt = require('jsonwebtoken');
var config = require('./config');
exports.verifyAccessToken = (req, res, next) => {
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