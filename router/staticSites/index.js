const homePage = (req, res) => {

    res.render('index',{
        loggedUser : req.user  
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