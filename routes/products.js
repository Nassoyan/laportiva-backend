const express = require("express");
const router = express.Router();
const client = require("../bin/config/database");
const path = require('path');

const fs = require("fs");
const fileUpload = require('express-fileupload');
router.use(fileUpload());
const baseURL = 'http://localhost:3000/';

const Products = require("../models/products"); 
const Image = require('../models/productImages');

router.use(express.json())

router.get("/", async (req, res) => {
    try {
        const products = await Products.findAll( {
            include: [{ model: Image, as:'images' }]
        })
        res.json(products)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/', async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        if (!fs.existsSync(path.join('public', 'productImages'))) {
            fs.mkdirSync(path.join('public', 'productImages'), { recursive: true });
        }
        
        const productFile = Date.now() + '-' + req.files.product_images.name;
        const uploadPath = path.join('public/productImages', productFile);
        const imageUrl = baseURL + uploadPath;

        const { name, price, artikul, code, brand_id } = req.body;
        await req.files.product_images.mv(uploadPath);
        console.log(imageUrl);
        const newProduct = await Products.create({ name, price, artikul, code, brand_id });
        const newProductImage = await Image.create({ image_url: imageUrl, product_id: newProduct.id });

        res.json({ newProduct, newProductImage });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send(err);
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
        await Products.destroy({
            where: {
              id:req.params.id
            },
            // truncate:true,
            // restartIdentity:true
          });
        
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router
