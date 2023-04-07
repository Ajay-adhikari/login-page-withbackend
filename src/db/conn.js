const mongoose=require("mongoose");
mongoose.connect("mongodb://0.0.0.0:27017/friendregistration" ,
{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    
}).then(()=>{
    console.log("connected to db");
}).catch((e)=>{
    console.log("notconnected");
})