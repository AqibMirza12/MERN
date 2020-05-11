const express = require('express');
const {check} = require('express-validator');

const usersControllers = require('../controllers/users-controller');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', usersControllers.getUsers); //has to be pointer

router.post('/signup',
  fileUpload.single('image'),  
[
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(), //normaliseEmail converts to lowercase, isEmail checks validity
    check('password').isLength({min: 6})
] ,usersControllers.signup
);

router.post('/login', usersControllers.login);

module.exports = router; //exporting class