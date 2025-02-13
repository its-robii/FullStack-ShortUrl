const validateEmail = require("../../helpers/emailValidate");
const RegistrationSchema = require("../../modal/RegistrationSchema");
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
const loginUser = async (req, res)=>{

    try {
      const {email, password} = req.body 

    if (!email) {
        return res.status(400).send({error : "email is required"});
      }
      if (!validateEmail(email)) {
        return res.status(400).send({error : "email is not valid"});
      }
      if (!password) {
        return res.status(400).send({error : "password is required"});
      }

      const existUser = await RegistrationSchema.findOne({email})

      if (!existUser) {
        return res.status(400).send({ error: "User not found 404"});
      }

      const match = await bcrypt.compare(password, existUser.password);

      if(!match) {
        return res.status(400).send({error : "Authentication failed"});
      }
      //jwt token generate
     const acces_token = jwt.sign({
        data: {
          id : existUser._id,
          email : existUser.email
        }
      }, process.env.JWT_KEY, { expiresIn: '1d' });

      const loggedUser = {
        id : existUser._id,
        email : existUser.email,
        fullName : existUser.fullName
      }
      
      res.status(200).cookie("acces_token",acces_token).send({massage : " login succssefull", acces_token, loggedUser })
    } catch (error) {
      return res.status(400).send({error : "Server side error! please try again"});
    }
 
    }
    
module.exports = loginUser