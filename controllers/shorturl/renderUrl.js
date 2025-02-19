const ShortUrlSchema = require("../../modal/ShortUrlSchema");

const renderUrl = async (req, res)=>{
    const shortID = req.params.shortId;

    const existUrl = await ShortUrlSchema.findOne({shortID})    

    if(!existUrl){
     return  res.render("error")
    }
    
    if(existUrl.isAuth) {
        const authUrl = await ShortUrlSchema.findByIdAndUpdate(existUrl._id,{$push: {visitHistory:{clickedAt: Date.now()}}}, {new: true})
        res.redirect(existUrl.url)
    }else {
        res.redirect(existUrl.url)  
    }

    
}


module.exports = {renderUrl};