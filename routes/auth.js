const User = require("../models/user")

const express = require("express");
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.use(express.json());



router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password, "--> email and password");

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        } else {
            console.log("User exists!!! nasoyan")
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ userId: user._id }, 'yourSecretKey', { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router