const express = require('express');
const router = express.Router();
const {
    createProduct,
    getProduct,
    getProductById,
    updateProductById,
    getPhoto,
    filterProducts
} = require('../controllers/productController');
const admin = require('../middlewares/admin');
const authorize = require('../middlewares/authorization');


router.route('/')
    .post([authorize, admin], createProduct)
    .get(getProduct)
router.route('/:id')
    .get(getProductById)
    .put([authorize, admin], updateProductById)
router.route('/photo/:id')
    .get(getPhoto)
router.route('/filter')
    .post(filterProducts)
module.exports = router