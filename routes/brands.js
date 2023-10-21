const express = require('express');
const router = express.Router();
const client = require("../bin/config/database");
const formidable = require('formidable');
const path = require('path');
const fs = require("fs")
const baseURL = 'http://localhost:3000/';

const Brands = require("../models/brands"); 

router.use(express.json());

router.get('/', async (req, res) => {
    try {
        const brands = await Brands.findAll(); 
        res.json(brands);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            const oldPath = files.image[0].filepath;

            const newName = Date.now() + '-' + files.image[0].originalFilename;
            const newPath = path.join('public/images', newName);

            const uploadDir = path.join(__dirname, '..', 'public/images');
            if (!fs.existsSync(uploadDir, "uploadDir")) {
                fs.mkdirSync(uploadDir);
            }


            fs.rename(oldPath, newPath, async (err) => {
                console.log(newPath, "newpath");
                if (err) {
                    console.error('Error while parsing form:', err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                const { name } = fields;
                const firstName = name[0];


                const imagePath = newPath.substring(newPath.indexOf('/laportiva_backend')); // Assuming the key is 'image'
                const image_url = baseURL + imagePath;
                console.log(image_url, "imagePath");

                const newBrand = await Brands.create({ name:firstName, image_url: image_url });

                res.json(newBrand);
            })

        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const updatedBrand = await Brands.findByIdAndUpdate(req.params.id, req.body, { new: true }); 
        
        res.json(updatedBrand);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.delete('/:id', async (req, res) => {
    try {
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
