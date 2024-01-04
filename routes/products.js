const express = require("express");
const router = express.Router();
const client = require("../bin/config/database");
const path = require('path');
require('dotenv').config()


const fs = require("fs");
const fileUpload = require('express-fileupload');
router.use(fileUpload());
const { validateProduct, checkValidationResult } = require('../validations/products/validation');
const baseURL = process.env.DB_URL;

const Product = require("../models/product"); 
const Image = require('../models/productImages');
const { deleteImageFromProductsFolder } = require('../utils/products/productHelper')

const {sequelize} = require('../bin/config/database');
const { Op } = require('sequelize'); 
const  ProductCategory  = require("../models/productCategory");
const Category = require("../models/category");

const rootDirectory = path.join(__dirname, '../');


router.use(express.json())

router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.size) || 10; 
        const offset = (page - 1) * limit;

        const { search } = req.query;
        const searchedValue = search ? {
            [Op.or]: [
                { name: { [Op.iLike]: `%${search}%` } },
                { code: { [Op.iLike]: `%${search}%` } },
                { artikul: { [Op.iLike]: `%${search}%` } },
            ],
          }
        : {};

        const { brand_id, categories } = req.query;

        const categoryIds = categories? categories.split(",").map(item => parseInt(item)) : [];
        console.log(`categoryIds -> ${categoryIds}`);

        const products = await Product.findAndCountAll({
            include: [{ model: Image, as: 'images' }, {
                 model: ProductCategory,
                 as: "items",
                 where: categoryIds.length > 0 ? { id: { [Op.in]: categoryIds } } : {},
                 required: categoryIds.length > 0
                }],
            where: {
                [Op.and]: [
                    searchedValue,
                    brand_id ? { brand_id: brand_id } : {}, // Add this condition if brand_id is provided
                ],
            },
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
        const product = await Product.findOne({
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

        const { name, price, artikul, code, brand_id, category_ids } = req.body;
        await req.files.product_images.mv(uploadPath);

        const newProduct = await Product.create({ name, price, artikul, code, brand_id }, {transaction:t});
        const newProductImage = await Image.create({ image_url: imageUrl, product_id: newProduct.id },{transaction:t});
        console.log(req.body,"reqbody");
        console.log(category_ids,"->category_ids");

        const categoryIds = JSON.parse(category_ids);

        // Handle category association
        for (const categoryId of categoryIds) {
            await ProductCategory.create({
                product_id: newProduct.id,
                category_id: categoryId
            }, { transaction: t });
        }

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
        const product = await Product.findByPk(req.params.id);
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
        await deleteImageFromProductsFolder(rootDirectory, productImage)

        const product = await Product.findByPk(req.params.id); 
        
        await product.destroy();

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router

//yndhanur petqa avelana filter bolor brandneri hamar apaki, keramika, metax, bambuk
//paheluc wilmaxi vra petqa beri nayev byureghapaki, keramika, akacia, bambuk, metax, stone
//avelanum e nayev search yst price-i
//product id sort