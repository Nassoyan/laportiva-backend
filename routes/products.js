const express = require("express");
const router = express.Router();
const client = require("../bin/config/database");
const path = require('path');

const fs = require("fs");
const fileUpload = require('express-fileupload');
router.use(fileUpload());
const { validateProduct, checkValidationResult } = require('../utils/products/validation');
const baseURL = 'http://localhost:3000/';

const Products = require("../models/products"); 
const Image = require('../models/productImages');
const { deleteImageFromProductsFolder } = require('../utils/products/productHelper')

const {sequelize} = require('../bin/config/database')
const rootDirectory = path.join(__dirname, '../');


router.use(express.json())

router.get("/", async (req, res) => {
    try {
         const page = parseInt(req.query.page) || 1;
         const limit = parseInt(req.query.size) || 10; 

        const offset = (page - 1) * limit;

        const products = await Products.findAndCountAll({
            include: [{ model: Image, as: 'images' }],
            limit,
            offset,
        });

        const totalPages = Math.ceil(products.count / limit);

        res.json({
            currentPage: page,
            totalPages: totalPages,
            products: products.rows,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get("/:id", async(req, res) => {
    try{
        const id = req.params.id
        const product = await Products.findOne({
            where: {
                id
            }
        })
        res.json(product)
    } catch(err) {
        console.error(err)
    }
})

router.post('/',validateProduct, checkValidationResult, async (req, res) => {

 

    const t = await sequelize.transaction()
    
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('image is required!!!.');
        }
        if (!fs.existsSync(path.join('public', 'productImages'))) {
            fs.mkdirSync(path.join('public', 'productImages'), { recursive: true });
        }

        const productFile = Date.now() + '-' + req.files.product_images.name;
        const uploadPath = path.join('public/productImages', productFile);
        const imageUrl = baseURL + uploadPath;

        const { name, price, artikul, code, brand_id } = req.body;
        await req.files.product_images.mv(uploadPath);

        const newProduct = await Products.create({ name, price, artikul, code, brand_id }, {transaction:t});
        const newProductImage = await Image.create({ image_url: imageUrl, product_id: newProduct.id },{transaction:t});

        await t.commit()

        res.json({ newProduct, newProductImage });
    } catch (err) {
        await t.rollback()
        console.error("Error:", err);
        res.status(500).send("Failed to add a product");
    }
});


router.put('/:id', async (req, res) => {
    try {
        const product = await Products.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const updatedProduct = await product.update(req.body);
        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const productImage = await Image.findByPk(req.params.id); 
        if (!productImage) {
            return res.status(404).json({ error: 'Product not found' });
        }
        console.log(productImage, "productImageeee");
        await deleteImageFromProductsFolder(rootDirectory, productImage)

        const product = await Products.findByPk(req.params.id); 
        
        await product.destroy();

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router
