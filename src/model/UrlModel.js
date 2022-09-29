const mongoose = require("mongoose")

const urlSchema = new mongoose.Schema({
    urlCode :{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
        trim:true
    },
    longUrl:{
        type:String,
        required:true,
    },

    shortUrl:{
        type: String,
        unique:true,
        required:true
    }
},{timestamps:true})


module.exports = mongoose.model("url",urlSchema)