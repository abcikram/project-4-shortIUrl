const express = require("express")
const route = require("./route/route")
const mongoose = require("mongoose")
const app = express()


app.use(express.json())


mongoose.connect("mongodb+srv://shishir1912-DB:F85ml8mUXi1MrEKV@cluster0.2ta5zuw.mongodb.net/group45Database",
{useNewUrlParser:true}
)
.then(()=>console.log("mongoose connected successfully"))
.catch((err)=>err)

app.use("/",route)

app.listen(process.env.PORT||3000,function(){
    console.log("express is running port" + (process.env.PORT||3000) )
})

