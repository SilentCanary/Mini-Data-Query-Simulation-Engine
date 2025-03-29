const express = require("express");
const router = express.Router();

const cookie_parser=require("cookie-parser");
const jwt=require("jsonwebtoken");

router.use(cookie_parser());

const SECRET_KEY="password";

router.post("/login",(req,res)=>{
    const {username,password}=req.body;
    if(username=='admin' && password=='password')
    {
        const token=jwt.sign({username},SECRET_KEY,{expiresIn:"1h"});
        res.cookie("auth_token",token,{
            httpOnly:true,
            secure:false,
            sameSite:"strict"
        });
        return res.json({message:"Login successful"});
    }
    res.status(401).json({error:"invalid credentials"});
})

router.post("/logout",(req,res)=>{
    res.clearCookie("auth_token");
    res.json({message:"logout successful"})
});

module.exports=router;