const router = require('express').Router();
const { signUp, verifyOtpSignup, loginUser, verifyOtpLogin } = require('../Controller/userController');

router.route('/signup')
    .post(signUp);
router.route('/signup/verify')
    .post(verifyOtpSignup);
router.route('/login').post(loginUser);
router.route('/login/verify').post(verifyOtpLogin);

module.exports = router;