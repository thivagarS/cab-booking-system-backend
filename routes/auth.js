const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

/*
    @Method - POST
    @Auth - not required
    @Desc - This route is used to add user to the application
*/
router.post('/signup', authController.postSignupUser);

module.exports = router;