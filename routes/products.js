const express = require("express");
const router = express.Router();
const client = require("../bin/config/database");

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
        const newProducts = new Products(req.body); 
        const savedProducts = await newProducts.save();
        
        res.json(savedProducts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
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
          });
        
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router
