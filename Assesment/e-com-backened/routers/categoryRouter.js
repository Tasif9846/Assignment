const express = require('express');
const router = express.Router();
const { createCategory, getCategories } = require('../controllers/categoryControllers');
const admin = require('../middlewares/admin');
const authorize = require('../middlewares/authorization');

router.route('/')
    .post([authorize, admin], createCategory)
    .get(getCategories);

module.exports = router;