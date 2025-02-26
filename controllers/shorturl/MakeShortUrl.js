const generateShortId = require("../../helpers/generateShortId");
const isUrlValid = require("../../helpers/isUrlValid");
const RegistrationSchema = require("../../modal/RegistrationSchema");
const ShortUrlSchema = require("../../modal/ShortUrlSchema");
const baseUrl = process.env.BASE_URL || "http://localhost:8000";


const MakeShortUrl = async (req, res)=>{
    const baseUrl = process.env.BASE_URL || "http://localhost:8000";
        try {
            const {url} = req.body;
  
            if(!url){
                return res.render("index", {
                    error: "URL is required!",
                })
            }
            if(!isUrlValid(url)){
                return res.render("index", {
                    error: "URL is not valid!",
                })
            }
            const shorted = generateShortId(url)
          
            if(req.user) {
        
                const existUrl = await ShortUrlSchema.findOneAndUpdate({url}, {$set: {shortID: shorted}},  { new: true })
                if(existUrl){
                    return res.render("index", {
                        message: "Short Url created successfully!",
                        longUrl: existUrl.url,
                        shortUrl: `${process.env.BASE_URL|| baseUrl}${existUrl.shortID}`,
                        loggedUser : req.user 
                    })
                }
             
                const shortUrl = new ShortUrlSchema({
                    url: url,
                    shortID: shorted,
                    isAuth : true
                })
            
                await shortUrl.save()
               
               await RegistrationSchema.findByIdAndUpdate(req.user.id,{$push: {shortUrls: shortUrl._id}})
               
                res.render("index", {
                    message: "Short Url created successfully!",
                    longUrl: shortUrl.url,
                    shortUrl: `${process.env.BASE_URL|| baseUrl}/${shortUrl.shortID}`,
                    loggedUser : req.user 
                })  
        
            } else {
        
            const existUrl = await ShortUrlSchema.findOneAndUpdate({url}, {$set: {shortID: shorted}},  { new: true })
        
            if(existUrl){
                return res.render("index", {
                    message: "Short Url created successfully!",
                    longUrl: existUrl.url,
                    shortUrl: `${process.env.BASE_URL|| baseUrl}}/${existUrl.shortID}`
                })
            }
         
            const shortUrl = new ShortUrlSchema({
                url: url,
                shortID: shorted
            })
        
            shortUrl.save()
        
            res.render("index", {
                message: "Short Url created successfully!",
                longUrl: shortUrl.url,
                shortUrl: `${process.env.BASE_URL|| baseUrl}/${shortUrl.shortID}`
            })
          }
        } catch (error) {
            return res.status(400).send({error : "Server side error! please try again"});
        }
}


module.exports = MakeShortUrl;