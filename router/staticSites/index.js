const baseUrl = process.env.BASE_URL || "http://localhost:10000";
const homePage = (req, res) => {

    res.render('index',{
        loggedUser : req.user,
        baseUrl 
    });

}
const loginPage = (req, res) => {

    res.render('login',{
        baseUrl
    });

}

const registrationPage = (req, res) => {

    res.render('registration',{
        baseUrl
    });

}

module.exports = {homePage, loginPage, registrationPage}