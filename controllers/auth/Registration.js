const validateEmail = require("../../helpers/emailValidate");
const validatePassword = require("../../helpers/passValidate");
const RegistrationSchema = require("../../modal/RegistrationSchema");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const registration = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName) {
      return res.status(400).send({error : "Name is required"});
    }
    if (!email) {
      return res.status(400).send({error : "email is required"});
    }
    if (!validateEmail(email)) {
      return res.status(400).send({error : "email is not valid"});
    }
    if (!password) {
      return res.status(400).send({error : "password is required"});
    }

    const passwordResult = validatePassword(password);

    if (passwordResult) {
      return res.status(400).send({error : passwordResult});
    }

    const existingUser = await RegistrationSchema.findOne({ email });

    if (existingUser) {
      return res.status(400).send({error: "This email is already registered ! try with another one" });
    }

    bcrypt.hash(password, saltRounds, function (err, hash) {

      const registrationData = RegistrationSchema({
        fullName,
        email,
        password : hash,
      });

      registrationData.save();

      res.redirect("/login")
    });

  } catch (error) {
    return res.status(400).send({error : "Server side error! please try again"});
  }
};

module.exports = registration;
