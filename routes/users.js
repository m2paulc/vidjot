const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//User login Route
router.get('/login', (req, res) => {
    res.render('users/login');
});

//User Registration Route
router.get('/register', (req, res) => {
    res.render('users/register');
});

module.exports = router;