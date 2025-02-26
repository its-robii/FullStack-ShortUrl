const express = require('express');
const apiRoute = require('./api');
const {renderUrl, visitHistory} = require('../controllers/shorturl/renderUrl');
const { homePage, loginPage, registrationPage } = require('./staticSites');
const validateUser = require('../Middlewares/authMiddleware');
const RegistrationSchema = require('../modal/RegistrationSchema');
const router = express.Router();
const baseUrl = process.env.BASE_URL || "http://localhost:8000";


router.use(process.env.BASE_API_URL, apiRoute)


router.get('/', validateUser, homePage);

router.get('/login', loginPage);
router.get('/registration', registrationPage);

router.get("/dashboard", validateUser, async (req, res) => {
    if(req.user) {
        const userData = await RegistrationSchema.findById(req.user.id).select("-password").populate("shortUrls")
        res.render("dashboard", {
            urlHistory : userData, 
            loggedUser : req.user ,
            baseUrl 
        })
    }else {
        res.redirect("/")
    }
})
router.post('/logout', (req, res) => {
    res.clearCookie("acces_token", {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",  // Secure only in production
        sameSite: "Lax",
        path: "/"
    });
    res.status(200).json({ message: "Logged out successfully" });
});

router.get("/:shortId", renderUrl)

router.use((req, res)=>{
    res.render("error")
})

module.exports = router;