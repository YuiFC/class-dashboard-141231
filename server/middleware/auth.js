//server/middleware/auth.js

const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('x-auth-token');

  if(!token){
    return res.status(401).json({message: '没有提供token，访问被拒绝'});
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({message: '无效的token，访问被拒绝'});
  }
};