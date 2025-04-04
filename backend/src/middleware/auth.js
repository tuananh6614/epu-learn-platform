const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Không có token, xác thực thất bại' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Không có thông tin người dùng' });
    }
    
    const hasRole = roles.includes(req.user.role);
    
    if (!hasRole) {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }
    
    next();
  };
};

module.exports = { verifyToken, checkRole }; 