
const express = require("express")
const route = express.Router()
const{urlcreation,geturl} = require("../controller/UrlController")

route.post("/url/shorten",urlcreation)
route.get("/:urlCode",geturl)
route.all("/*",function(req,res){
    return res.status(400).send({status:false,message:"path not found"})
})












module.exports= route