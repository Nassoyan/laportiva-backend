const express = require('express');
const router = express.Router();
const client = require("../bin/config/database");
const path = require('path');
const fs = require("fs");
const fileUpload = require('express-fileupload');
router.use(fileUpload());
const { validateProduct, checkValidationResult } = require('../validations/brands/validation');
require('dotenv').config()


const baseURL = process.env.DB_URL;

const Brands = require("../models/brands"); 
const { deleteImageFromBrandFolder } = require('../utils/brands/brandHelper')

const rootDirectory = path.join(__dirname, '../');


router.use(express.json());

router.get('/', async (req, res) => {
    try {
        const brands = await Brands.findAll(); 
        res.json(brands);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const brand = await Brands.findOne({ 
        where: {
          id: id 
        } 
});
    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.post('/', validateProduct, checkValidationResult, async (req, res) => {

    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        if (!fs.existsSync(path.join('public', 'brandImages'))) {
            fs.mkdirSync(path.join('public', 'brandImages'), { recursive: true });
          }

        const brandFile = Date.now() + '-' + req.files.image.name;
        const uploadPath = path.join('public/brandImages', brandFile);
        const imageUrl = baseURL + uploadPath

        const brandName = req.body.name;
        
        await req.files.image.mv(uploadPath); 

        const newBrand = await Brands.create({ name: brandName, image_url: imageUrl });
        res.json(newBrand);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send(err);
    }
});



router.put('/:id', async (req, res) => {
    try {
        const brandId = req.params.id;
        const { name } = req.body;

        const updatedBrand = await Brands.findByPk(brandId);

        if (updatedBrand) {
            updatedBrand.name = name;
            await updatedBrand.save();
            res.json(updatedBrand);
        } else {
            res.status(404).json({ error: 'Brand not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.delete('/:id', async (req, res) => {
    try {
        const brandImage = await Brands.findByPk(req.params.id)
        if (!brandImage) {
            return res.status(404).json({ error: 'Brand not found' });
        }

        await deleteImageFromBrandFolder(rootDirectory, brandImage)


        await Brands.destroy({
            where: {
                id: req.params.id
            },
            // truncate:true,
            // restartIdentity:true
        });
        res.json({ message: 'Brand deleted successfully' });
    } catch (error) {
        console.error('Error while deleting brand:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
