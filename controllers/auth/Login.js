const validateEmail = require("../../helpers/emailValidate");
const RegistrationSchema = require("../../modal/RegistrationSchema");
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
   // Rjhds&hf1
    try {
        const { email, password } = req.body;
        let errors = [];
        const baseUrl = process.env.BASE_URL || "http://localhost:10000"; // Define baseUrl

        if (!email) {
            errors.push("Email is required");
        } else if (!validateEmail(email)) {
            errors.push("Email is not valid");
        }

        if (!password) {
            errors.push("Password is required");
        }

        if (errors.length > 0) {
            return res.render("login", { baseUrl, errors });
        }

        const existUser = await RegistrationSchema.findOne({ email });

        if (!existUser) {
            return res.render("login", { baseUrl, errors: ["User not found!"] });
        }

        const match = await bcrypt.compare(password, existUser.password);

        if (!match) {
            return res.render("login", { baseUrl, errors: ["Authentication failed! Invalid password."] });
        }

        const access_token = jwt.sign(
            { data: { id: existUser._id, email: existUser.email } },
            process.env.JWT_KEY,
            { expiresIn: '1d' }
        );

        res.cookie("access_token", access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            path: "/"
        });

        res.redirect("/");
    } catch (error) {
        console.error("Login error:", error); // Log the actual error for debugging
        return res.render("login", { baseUrl: process.env.BASE_URL || "http://localhost:10000", errors: ["Server side error! Please try again."] });
    }
};

module.exports = loginUser;

