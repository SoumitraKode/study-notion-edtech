//Requirements
const User = require("../models/User") ;
const mailSender = require("../utils/mailSender") ;
const crypto = require("crypto") ;
const bcrypt = require("bcrypt");
exports.resetPasswordToken = async(req,res)=>{
    try {
        //collect data from requ body
        const {email} = req.body ;
        //Check if user exist
        //valid -1

        if(!email){
            return res.status(400).json({
                success:false,
                message:"Email field is Required",
            });
        }

        //Vald-2
        const existing_User = await User.findOne({email});
        //if user does not exist

        if(!existing_User){
            return res.status(400).json({
                success:false,
                message:"Invalid Emiail-id",
            })
        }

        //Generate TOKEN
        const token = crypto.randomBytes(20).toString("hex");

        //update user by addinig token and expiry
        const updated_User = await User.findOneAndUpdate({email},
            {
                //Why did we put token in user ?? Ans on Line ==>73
                token:token,
                resetPasswordExpires:Date.now()+ 5*60*1000 ,
            
            },
            {new:true}
        );
        console.log("Updated User : "+updated_User) ;

        //create url
        const url = `http://localhost:3000/update-password/${token}` ;
        //send mail containing the URL
        try {
            const mail_responce = await mailSender(
                email,
                "Password Reset Link",
                `Link : ${url}` ,
            );
            console.log(mail_responce) ;
        } catch (error) {
            console.log("Error while sending mail");
            console.log(error.message);
            console.log(error) ;
            return res.status({
                success:false ,
                message:error.message,
            });
        }
        //return resposnse
        return res.status(200).json({
            success:true,
            message:"Link Sent to Email Successfully",
            
        })


    } catch (error) {
        console.log("Error while sending Reset Link", error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong. Reset Email not Sent ",
        })
    }
}

exports.resetPassword = async(req,res)=>{
    try {
        //data fetch
        //How did token came in body ??
        //Request kaha se aai hai ?? ==> Front end ne pakad ke dala hai isse body mei !!!
        const {password,confirmPassword,token} = req.body ;
        //validation
        if(password !== confirmPassword){
            return res.json({
                success:true,
                message:"Password Not matching",
            });
        }
        //We have now got the user password ==> So we have to update it in the user Scheema 
        // => For that we should have the user ==> How we will Bring the user ?? ==> With the help of token !!!
        //get user details from db using tooken
        const existing_User = await User.findOne({token:token}) ;
        //if No Entry - invalid token
        if(!existing_User){
            return res.json({
                success:false,
                message:"Token is Invalid",
            })
        }

        //token time check
        if(Date.now() > existing_User.resetPasswordExpires){
            return res.json({
                success:false,
                message:"Token is Expired , Please Regenerate Token" ,
            })
        }
        //hashed password
        const hasedpassword = await bcrypt.hash(password,10) ;

        //password Update
        await User.findOneAndUpdate(
            {token},
            {password:hasedpassword},
            {new:true},
        );
        return res.status(200).json({
            success:true,
            message:"Password Reset Successfull",
        });
    } catch (error) {
        console.log("Issue while Resetting  Password : ",error);
        return res.status(500).json({
            success:false,
            message:"Something went Wrong !!! ",
        })
    }
}