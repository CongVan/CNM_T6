var jwt = require('jsonwebtoken');
var config = require('./config');
var driver=require('./models/driver');
var io=require('./socketIO');
var clientDB=require('./models/clientDB');
exports.verifyAccessToken = (req, res, next) => {
    // console.log(req.headers);
    // if(req.Url.pathname=='/driver/login'){
    //   next();
    // }
    var token = req.headers["x-access-token"];
    var rtoken = req.headers["x-refresh-token"];
    //  console.log(token,' == ',rtoken);
    if (token) {
        jwt.verify(token, config.secret, (err, payload) => {
            if (err) {
                // res.statusCode = 403;
                if(rtoken){
                    driver.checkRefreshToken(rtoken)
                    .then(results=>{
                        if(results.length>0){
                            var pl = {
                                data: results[0]
                            };
                            var token = jwt.sign(pl, config.secret, { expiresIn: config.expiredJWT });
                            // req.newToken = token;
                            // console.log('check' ,results);
                             var socketId=clientDB.getClientByUserId(results[0].id);
                            //  console.log(socketId, results[0].id);
                            
                            io.sockets.connected[socketId].emit('refreshToken', {token:token});
                            next();
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