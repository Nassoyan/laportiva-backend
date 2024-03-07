const express = require("express");
const router = express.Router();
const User = require("../models/user")

const bcrypt = require('bcrypt');
require('dotenv').config()

const jwt = require('jsonwebtoken');

router.use(express.json());

router.get("/", async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Cannot get Users', message: error.message });
    }
});


router.post("/", async (req, res) => {
    try {
        console.log(req, "-> reqqqnaaaa");
        const { email, password } = req.body;

        // Check if either email or password is falsy
        if (!email || !password) {
            return res.status(404).send("email and password may be undefined");
        }

        const hashedPwd = await bcrypt.hash(password, 10)

        console.log(hashedPwd, "-> hashed password");
        const newUser = await User.create({ email, password:hashedPwd });
        res.json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});


router.delete("/:id", async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id)
        if(!user) {
            return res.status(404).send("User not found")
        }

        await User.destroy({
            where: {
                id: req.params.id
            }
        })

        res.status(200).send("User deleted successfully");

    } catch (error) {
        console.error(error)
        res.status(500).send("Error deleting the user")
    }
})




module.exports = router


