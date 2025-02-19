const express = require('express');
const MakeShortUrl = require('../../controllers/shorturl/MakeShortUrl');
const validateUser = require('../../Middlewares/authMiddleware');
const shorturlRoute = express.Router();

shorturlRoute.post("/shortUrl", validateUser,  MakeShortUrl)

module.exports = shorturlRoute;