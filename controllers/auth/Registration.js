const validateEmail = require("../../helpers/emailValidate");
const validatePassword = require("../../helpers/passValidate");
const RegistrationSchema = require("../../modal/RegistrationSchema");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const registration = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    let errors = [];

    if (!fullName) {
      errors.push("Name is required");
    }
    if (!email) {
      errors.push("Email is required");
    } else if (!validateEmail(email)) {
      errors.push("Email is not valid");
    }
    if (!password) {
      errors.push("Password is required");
    } else {
      const passwordResult = validatePassword(password);
      if (passwordResult) {
        errors.push(passwordResult);
      }
    }

    const existingUser = await RegistrationSchema.findOne({ email });
    if (existingUser) {
      errors.push("This email is already registered! Try with another one.");
    }

    // If there are errors, re-render the registration page with the errors
    if (errors.length > 0) {
      return res.render("registration", { baseUrl: process.env.BASE_URL || "http://localhost:10000", errors });
    }

    // Hash the password and save the user
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      if (err) {
        return res.render("registration", { baseUrl, errors: ["Error hashing password! Please try again."] });
      }

      const registrationData = new RegistrationSchema({
        fullName,
        email,
        password: hash,
      });

      await registrationData.save();

      res.redirect("/login");
    });

  } catch (error) {
    return res.render("registration", { baseUrl, errors: ["Server side error! Please try again."] });
  }
};

module.exports = registration;

