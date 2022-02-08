const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegisterForm)
    .post(catchAsync(users.createUser))

router.route('/login')
    .get(users.renderLogInPage)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.logIn)

router.get('/logout', users.logOut)
module.exports = router;