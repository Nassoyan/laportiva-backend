const express = require("express");
const router = express.Router();
const client = require("../bin/config/database");
const path = require('path');
require('dotenv').config()
const { QueryTypes } = require('sequelize');

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
        const limit = parseInt(req.query.size) || 9; 
        const offset = (page - 1) * limit;

        const { search, order_id } = req.query;
        const searchedValue = search ? {
            [Op.or]: [
                { name: { [Op.iLike]: `%${search}%` } },
                { name_ru: { [Op.iLike]: `%${search}%` } },
                { name_en: { [Op.iLike]: `%${search}%` } },
                { code: { [Op.iLike]: `%${search}%` } },
                { artikul: { [Op.iLike]: `%${search}%` } },
            ],
          }
        : {};

        const { brand_id, categories } = req.query;

        const categoryIds = categories? categories.split(",").map(item => parseInt(item)) : [];

        const order = order_id === 'desc' ? [['id', 'DESC']] : [['id', 'ASC']];

        let ids = [];
        if(categoryIds.length) {
            ids = await sequelize.query(`select product_id from product_categories where category_id in
            (${categoryIds.join(',')})
           group by product_id having count(distinct id) >= ${categoryIds.length}`, { type: QueryTypes.SELECT });

            ids = ids.map(item => item.product_id);


            if(!ids.length) {
                return res.json({
                    currentPage: page,
                    totalPages: 0,
                    products: [],
                });
            }

        }

        const products = await Product.findAndCountAll({
            distinct: true,
            include: [{ model: Image, as: 'images' }, {
                 model: ProductCategory,
                 as: "items"
                }],
            where: {
                [Op.and]: [
                    searchedValue,
                    brand_id ? { brand_id: brand_id } : {}, // Add this condition if brand_id is provided
                ],
                id: {
                    [Op.or]: ids
                }
            },
            limit,
            offset,
            order
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
            },
            include: [
                { model: Image, as: 'images' },
            ],
        })
        res.json(product)
    } catch(err) {
        console.error(err)
    }
})

router.post('/', validateProduct, checkValidationResult, async (req, res) => {

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

        const { name, price, name_ru, name_en, outer_carton, inner_carton, artikul, code, brand_id, category_ids } = req.body;
        await req.files.product_images.mv(uploadPath);

        const newProduct = await Product.create({ name, price, name_ru, name_en, outer_carton, inner_carton, artikul, code, brand_id }, {transaction:t});
        const newProductImage = await Image.create({ image_url: imageUrl, product_id: newProduct.id },{transaction:t});

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
    const t = await sequelize.transaction();

    try {
        const productId = req.params.id;
        const product = await Product.findByPk(productId);

        const productImage = await Image.findOne({
            where: {
                product_id: productId
            }
        });
        console.log(productImage, "-> productImage");

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check if there's an existing image and a new image has been uploaded
        if (productImage && req.files && req.files.product_images && req.files.product_images.name !== productImage.image_url) {
            // Delete the existing image
            await deleteImageFromProductsFolder(rootDirectory, productImage);
        }

        // Check if a new image has been uploaded
        if (req.files?.product_images) {
            const productFile = Date.now() + '-' + req.files.product_images.name;
            const uploadPath = path.join('public/productImages', productFile);
            const imageUrl = baseURL + uploadPath;
            await req.files.product_images.mv(uploadPath);

            // Check if product has an associated image
            if (productImage) {
                // Update the existing image
                await productImage.update({ image_url: imageUrl }, { transaction: t });
            } else {
                // Create a new image
                await Image.create({ image_url: imageUrl, product_id: product.id }, { transaction: t });
            }
        }

        // Update the product
        const updatedProduct = await product.update(req.body);

        // Commit the transaction
        await t.commit();

        // Combine the results into a single response object
        const responseObj = { updatedProduct };

        // Send the response
        res.status(200).json(responseObj);
    } catch (error) {
        console.error('Error in PUT route:', error);
        // Rollback the transaction in case of an error
        await t.rollback();
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




router.delete('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const productImage = await Image.findOne({
            where: {
                product_id: productId
            }
        });
        const product = await Product.findByPk(req.params.id);
        console.log(productImage, "apaaaaa");
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        await deleteImageFromProductsFolder(rootDirectory, productImage)
        await ProductCategory.destroy({ where: { product_id: product.id } });
        await product.destroy();

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router