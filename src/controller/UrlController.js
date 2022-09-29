const urlModel = require("../model/UrlModel")
const shortid = require("shortid")
const validUrl = require("valid-url")

const urlcreation = async function(req,res){

    try{
    
        data = req.body
    longUrl = data.longUrl

    if(Object.keys(data).length === 0)return res.status(400).send({status:false,message:"data is required"})
    
    if(!longUrl)return res.status(400).send({status:false, message:"wrong longUrl"})

    if(!validUrl.isUri(longUrl))return res.status(400).send({status:false,message:"longUrl is not valid"})

    const urlexist = await urlModel.findOne({longUrl:longUrl}).select({_id:0,longUrl:1,urlCode:1,shortUrl:1})
    if(urlexist)return res.status(400).send({status:false,message:"longUrl already exist",data:urlexist})

    const urlCode = shortid.generate().toLowerCase()

    const baseUrl = "http://localhost:3000/"
    
    const obj = {
        longUrl: longUrl,
        shortUrl : baseUrl+urlCode, 
        urlCode: urlCode 
    }
    const createUrl = await  urlModel.create(obj)
    return res.status(201).send({status:true,message:"url created successfully",data:createUrl})

}catch(err){
    res.status(500).send({status:false,error:err.message})
}
    
}



const geturl = async function(req,res){
    let urlCode = req.params.urlCode

    let orignalUrl = await urlModel.findOne({urlCode:urlCode}).select({_id:0,longUrl:1})
   

    return res.status(302).redirect(orignalUrl.longUrl)
}

module.exports= {urlcreation,geturl}