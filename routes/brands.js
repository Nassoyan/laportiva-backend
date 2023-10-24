const express = require('express');
const router = express.Router();
const client = require("../bin/config/database");
const formidable = require('formidable');
const path = require('path');
const fs = require("fs");
const fileUpload = require('express-fileupload');
router.use(fileUpload());

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
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        if (!fs.existsSync(path.join('public', 'images'))) {
            fs.mkdirSync(path.join('public', 'images'), { recursive: true });
          }

        const brandFile = Date.now() + '-' + req.files.image.name;
        const uploadPath = path.join('public/images', brandFile);
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




// router.post('/', async (req, res) => {
//     try {
//         const form = new formidable.IncomingForm();
//         form.parse(req, async (err, fields, files) => {
//             const oldPath = files.image[0].filepath;

//             const newName = Date.now() + '-' + files.image[0].originalFilename;
//             const newPath = path.join('public/images', newName);

//             const uploadDir = path.join(__dirname, '..', 'public/images');
//             if (!fs.existsSync(uploadDir, "uploadDir")) {
//                 fs.mkdirSync(uploadDir);
//             }


//             fs.rename(oldPath, newPath, async (err) => {
//                 if (err) {
//                     console.error('Error while parsing form:', err);
//                     return res.status(500).json({ error: 'Internal Server Error' });
//                 }
//                 const { name } = fields;
//                 const firstName = name[0];


//                 const imagePath = newPath.substring(newPath.indexOf('/laportiva_backend')); // Assuming the key is 'image'
//                 const imageUrl = baseURL + imagePath;

//                 const newBrand = await Brands.create({ name:firstName, image_url: imageUrl});

//                 res.json(newBrand);
//             })

//         });
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });


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
