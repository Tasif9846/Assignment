const _ = require('lodash');
const { Product, validate } = require('../models/product');
const formidable = require('formidable');//npm i formidable=>form data handle kore ai package ta
const fs = require('fs');
const { builtinModules } = require('module');


module.exports.createProduct = async (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) return res.status(400).send("Something went wrong!");
        const { error } = validate(_.pick(fields, ["name", "description", "price", "category", "quantity"]))
        if (error) return res.status(400).send(error.details[0].message)

        const product = new Product(fields);
        if (files.photo) {
            fs.readFile(files.photo.filepath, (err, data) => {
                if (err) return res.status(500).send("Internal server error");
                product.photo.data = data;
                product.photo.contentType = files.photo.mimetype;
                product.save((err, result) => {
                    if (err) return res.status(500).send("Internal server error")
                    else return res.status(201).send({
                        message: "Product created successfully",
                        data: _.pick(result, ["name", "description", "price", "category", "quantity"])
                    })
                })
            })
        } else {
            return res.status(400).send("No image provided");
        }

    })
}
//Query string
//api/product?order=desc&sortBy=name&limit=10
module.exports.getProduct = async (req, res) => {
    let order = req.query.order === 'desc' ? -1 : 1;
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const products = await Product.find()
        .select({ photo: 0, description: 0 })
        .sort({ [sortBy]: order })
        .limit(limit)
        .populate('category', 'name createdAt');
    return res.status(200).send(products)
}
module.exports.getProductById = async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId)
        .select({ photo: 0 })
        .populate('category', 'name')
    if (!product) return res.status(404).send("Not found");
    return res.status(200).send(product);
}
module.exports.getPhoto = async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId)
        .select({ photo: 1, _id: 0 })
    res.set('Content-Type', product.photo.contentType);
    return res.status(200).send(product.photo.data);

}
//get productById
//collect form data
//update provided from fields
//update photo(if provided)
module.exports.updateProductById = async (req, res) => {

    const productId = req.params.id;
    const product = await Product.findById(productId);
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) return res.status(400).send("Something wrong");
        const updatedFields = _.pick(fields, ["name", "description", "price", "quantity", "category"]);
        _.assignIn(product, updatedFields);

        if (files.photo) {
            fs.readFile(files.photo.filepath, (err, data) => {
                if (err) return res.status(400).send("Something went wrong");
                product.photo.data = data;
                product.photo.contentType = files.photo.mimetype;
                product.save((err, result) => {
                    if (err) return res.status(500).status("Something went failed");
                    return res.status(200).send({
                        message: "Product updated successfully"
                    });
                })
            })
        } else {
            product.save((err, result) => {
                if (err) return res.status(500).send | ("Something went failed");
                return res.status(200).send({
                    message: "Product updated successfully"
                });
            })
        }
    })
}

const body = {
    order: 'desc',
    sortBy: 'price',
    limit: 6,
    skip: 0,
    filters: {
        price: [1000, 90000],
        category: ['6ksksfejfej22', '474jshkshwlsfh']
    }
}
module.exports.filterProducts = async (req, res) => {

    let order = req.body.order === 'desc' ? -1 : 1;
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = parseInt(req.body.skip);
    let filters = req.body.filters;
    let args = {}
    for (let key in filters) {
        if (filters[key].length > 0) {
            if (key === 'price') {
                // { price: {$gte: 0, $lte: 1000 }}
                args['price'] = {
                    $gte: filters['price'][0],
                    $lte: filters['price'][1]
                }
                console.log("args:", args);
            }
            if (key === 'category') {
                // category: { $in: [''] }
                args['category'] = {
                    $in: filters['category']
                }
                console.log("args:", args);
            }
        }
    }

    const products = await Product.find(args)
        .select({ photo: 0 })
        .populate('category', 'name')
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit)
    return res.status(200).send(products);
}

