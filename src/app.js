require('dotenv').config();
const express=require('express');
const app=express();
const path=require("path");
const hbs=require("hbs");
const bcrypt=require("bcryptjs");
console.log(process.env.SECRET_KEY);

require("./db/conn");
const Register=require("./models/registerstudent");
const port=process.env.PORT || 8000;
const static_path=path.join(__dirname , "../public");
const templatepath=path.join(__dirname , "../templates/views");
const partialspath=path.join(__dirname , "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path));
app.set("view engine" , "hbs");
app.set("views" , templatepath);
hbs.registerPartials(partialspath);


app.get("/" , (req , res)=>{
    res.render("index");
})

app.post("/register" , async(req, res)=>{
    try{
        
        
            const registerset=new Register({
                
                Username:req.body.Username,
                Number:req.body.Number,
                Gender:req.body.Gender,
                email:req.body.email,
                Password:req.body.Password
            })
            const token=await registerset.generateAuthToken();
            
            const result=await registerset.save();
            res.status(201).render("index");
            // console.log("here"+token);

            // res.cookie("jwt" , token , {
            //     expires:new Date(Date.now()+30000),
            //     httpOnly:true
            // });
            // console.log(cookie);
            
            
    }catch(e){
        res.status(400).send(e);
    }


})

app.post("/login" , async(req  , res)=>
{
    try{
        const email=req.body.email;
        const Password=req.body.Password;
        const userinfo=await Register.findOne({email:email});
        // console.log(email);
        // console.log(Password);
        // console.log(userinfo)
        const match=bcrypt.compare(Password , userinfo.Password);
        const token=await userinfo.generateAuthToken();
        // res.cookie("jwt" , token , {
        //     expires:new Date(Date.now()+30000),
        //     httpOnly:true
        // });
        console.log("this" + token);
        if(match)
        {
            res.send(userinfo);

        }
        else{
            res.send("INVALID USER");
        }
    }
    catch(e){
        res.send("INVALID USER");

    }
    

})
app.listen(port , ()=>{
    console.log("server is running");
})