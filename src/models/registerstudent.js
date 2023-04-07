require('dotenv').config()
const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");

const jwt=require("jsonwebtoken");
const studentschema=new mongoose.Schema({
    Username: {
        type:String,
        required:true,

    },
    Number :
    {
        type:Number,
        required:true,
        unique:true
    },
    Gender:{
        type:String,
        required:true
    },
    email:{
        type:String ,
        required:true,
        unique:true
    },
    Password:{
        type:String,
        required:true,
        
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]


})

studentschema.methods.generateAuthToken =async function(){
    try{
        console.log(this._id);
        const token=jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token});
        
        await this.save();console.log("here "+token);
        return token;
    }
    catch(e)
    {
        res.send("the error part+" +e);
    }
}
studentschema.pre("save" , async function(next){
    if(this.isModified("Password"))
    {
        console.log(`the pssword befire bcrypt is ${this.Password}`);
        this.Password=await bcrypt.hash(this.Password , 10);
        console.log(`the current password is ${this.Password}`);

        
    }
    next();
})
const Register= new mongoose.model("Register" , studentschema);





module.exports=Register;