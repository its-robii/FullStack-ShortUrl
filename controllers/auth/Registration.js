const validateEmail = require("../../helpers/emailValidate")
const validatePassword = require("../../helpers/passValidate")
const RegistrationSchema = require("../../modal/RegistrationSchema")

const registration = async (req, res)=>{

    try {
           const {fullName, email, password} = req.body
         
        if(!fullName){
           return res.status(400).send("Name is required")
        }
        if(!email){
         return res.status(400).send("email is required")
        }
        if(!validateEmail(email)) {
         return res.status(400).send("email is not valid")
        }
        if(!password){
         return res.status(400).send("password is required")
        }
     
        const passwordResult = (validatePassword(password));
     
        if (passwordResult) {
             return res.status(400).send(passwordResult)
        }
     
      const registrationData = await RegistrationSchema ({
         fullName, email, password
      })
     
      registrationData.save()
     
         res.send({
             massage : "registration successfull",
             registrationData
         })

       } catch(error) {
          return res.status(400).send("Server side error! please try again")
       }
}

module.exports = registration