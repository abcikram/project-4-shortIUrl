const urlModel = require("../model/UrlModel")
const shortid = require("shortid")
const validator = require("validator")

const urlcreation = async function(req,res){

    try{
    
        data = req.body
    const  longUrl = data.longUrl

    if(Object.keys(data).length === 0)return res.status(400).send({status:false,message:"data is required"})
    
    if(!longUrl)return res.status(400).send({status:false, message:"please enter longUrl"})

    if(typeof longUrl !== "string")return res.status(400).send({status:false,message:"url should be in string format"})

    if(!validator.isURL(longUrl))return res.status(400).send({status:false,message:"longUrl is not a valid Url"})

    const urlexist = await urlModel.findOne({longUrl:longUrl}).select({_id:0,longUrl:1,urlCode:1,shortUrl:1})
    if(urlexist)return res.status(200).send({status:false,message:"longUrl already exist",data:urlexist})

    const urlCode = shortid.generate().toLowerCase()

    const baseUrl = "http://localhost:3000"
    
    const obj = {
        longUrl: longUrl,
        shortUrl : baseUrl+"/"+urlCode, 
        urlCode: urlCode 
    }
    const createUrl = await  urlModel.create(obj)
    return res.status(201).send({status:true,message:"url created successfully",data:obj})

}catch(err){
    res.status(500).send({status:false,message:"server error",error:err.message})
}
    
}

const geturl = async function(req,res){
    try{
    let urlCode = req.params.urlCode

    if(urlCode == ":urlCode"){
        return res.status(400).send({status:false,message:"please enter urlcode in path param"})
    }
    if(/.*[A-Z].*/.test(urlCode)){
        return res.status(400).send({ status: false, message: "please Enter urlCode only in lowercase" })
    }
    const urlCodeexist = await urlModel.findOne({urlCode:urlCode})
    if(!urlCodeexist)return res.status(404).send({status:false,message:"urlcode not found"})

    let orignalUrl = await urlModel.findOne({urlCode:urlCode}).select({_id:0,longUrl:1})

    return res.status(302).redirect(orignalUrl.longUrl)

}catch(err){
    return res.status(500).send({status:false,message:"server error",error:err.message})
}
}

module.exports= {urlcreation,geturl}