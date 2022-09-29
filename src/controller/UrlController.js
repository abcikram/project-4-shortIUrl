const urlModel = require("../model/UrlModel")
const urlid = require("shortid")
const validUrl = require("valid-url")

const urlcreation = async function(req,res){
    try{

    longUrl = req.body.longUrl

    if(!longUrl)return res.status(400).send({status:false, message:"wrong longUrl"})

    if(!validUrl.isUri(longUrl))return res.status(400).send({status:false,message:"longUrl is not valid"})

    const urlexist = await urlModel.findOne({longUrl:longUrl})
    // if(urlexist)return res.status(400).send({status:false,message:"longUrl already exist"})
 
    const baseUrl = "http://localhost:3000"
    const urlCode = urlid.generate()
    const obj = {
        longUrl:longUrl,
         urlCode : urlCode.toLowerCase(),
         shortUrl : baseUrl+"/"+urlCode
    }
    
    const createUrl = await urlModel.create(obj)
    return res.status(201).send({status:true,message:"url created successfully",data:createUrl})

}catch(err){
    res.status(500).send({status:false,error:err.message})
}
    
}

module.exports= {urlcreation}