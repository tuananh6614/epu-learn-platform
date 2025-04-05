
const express = require('express');
const router = express.Router();
const { register, login, updateProfile } = require('../controllers/auth.controller');
const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validation.middleware');
const { auth } = require('../middleware/auth.middleware');

// Validation rules
const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự')
    .matches(/\d/)
    .withMessage('Mật khẩu phải chứa ít nhất 1 số'),
  body('full_name')
    .trim()
    .notEmpty()
    .withMessage('Họ tên không được để trống')
    .isLength({ min: 2 })
    .withMessage('Họ tên phải có ít nhất 2 ký tự')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Mật khẩu không được để trống')
];

const updateProfileValidation = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Họ tên phải có ít nhất 2 ký tự'),
  body('newPassword')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự')
];

router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
router.put('/update-profile', auth, updateProfileValidation, validateRequest, updateProfile);

module.exports = router; 
