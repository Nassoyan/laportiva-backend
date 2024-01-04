const express = require('express');
const router = express.Router();
// const client = require("../bin/config/database");
// const path = require('path');
// const fs = require("fs");
const { Op } = require('sequelize');

const Category = require('../models/category');
const ProductCategory = require('../models/productCategory');
const CategoryRelation = require('../models/categoryRelation');
const { sequelize } = require('../bin/config/database');
const res = require('express/lib/response');
const { QueryTypes } = require('sequelize');


router.use(express.json());

router.get('/', async (req, res) => {
    try {
        const categories = await Category.findAll(); 
        res.json(categories);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal Server Errorrrrr' });
    }
});

router.get("/categories-parents", async (req, res) => {
    try {
        const data = await sequelize.query(`select distinct categories.* from category_relations
        inner join categories on categories.id = category_relations.category_id
        where category_relations.parent_category_id is null`, { type: QueryTypes.SELECT });
        res.json(data);
    } catch (error) {
        console.error("something went wrong", error);
    }
})

router.get("/categories-children/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = await sequelize.query(`select distinct categories.* from category_relations
        inner join categories on categories.id = category_relations.category_id
        where category_relations.parent_category_id = ${id}`, { type: QueryTypes.SELECT });
        res.json(data);
    } catch (error) {
        console.error("something went wrong", error);
    }
})

router.get('/sub-category/:id', async (req, res) => {
    try {
        const parentId = req.params.id;
        console.log("id -> ", parentId);
        const categories = await Category.findAll( {
            where: {
                parent_ids: {
                    [Op.contains]: [parentId]
                }
            },
        }
        );
        console.log(categories); 
        res.json(categories);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal Server Errorrrrr' });
    }
});

router.post('/relation/add', async (req, res) => {
    try {
        const data = req.body;
        console.log(0);
        await processNestedObject(data, null);
        console.log(4);
        return res.status(201).json({ status: "OK" })
    } catch (err) {
        console.error("Error -> ", err);
        return res.status(500);
    }
})

async function processNestedObject(obj, parentId) {
    console.log(1)
    if(!obj) {
        return;
    }
   
    if (!obj.hasOwnProperty('child')) {
        await CategoryRelation.create({
            category_id: obj.id,
            parent_category_id: parentId,
            child_category_id: null
        })
        return;
    }
    console.log(2)

    await CategoryRelation.create({
        category_id: obj.id,
        parent_category_id: parentId,
        child_category_id: obj.child ? obj.child.id : null
    })

    console.log(3)

    // Recursive case: process the child object
    await processNestedObject(obj.child, obj.id);
}


router.post('/', async (req, res) => {
    try {
        const {name} = req.body;
        
        if (!name) {
            return res.status(400).json({ error: 'Category name is required' });
        }

        const newCategory = await Category.create({ name });
        res.json(newCategory);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send(err);
    }
});
    




router.delete('/:id', async (req, res) => {
    try {
        await Category.destroy({
            where: {
                id: req.params.id
            },
        });
        res.json({ message: 'Categorie deleted successfully' });
    } catch (error) {
        console.error('Error while deleting categorie:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
