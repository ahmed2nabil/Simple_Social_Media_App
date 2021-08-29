const jwt = require("jsonwebtoken");

const config = require('../utils/config');

exports.verfiyToken = (req,res,next) => {
    if(!req.headers['authorization']) {
 req.isAuth = false;
 return next();
    }
    var token = req.headers['authorization'].split(' ')[1];

if(!token) 
{
    req.isAuth = false;
    return next();   
}
jwt.verify(token,config.secret,function(err, decoded) {
    if(err) {
        req.isAuth = false;
        return next();
        }

    req.userId = decoded.id;
    req.isAuth = true;
    next();
})
}