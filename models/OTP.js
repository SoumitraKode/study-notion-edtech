const mongoose = require("mongoose") ;

const otpScheema = new mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
        },
        otp:{
            type:String,
            required:true,
        },
        createdAt:{
            type:Date,
            default:Date.now() ,
            expires: 5*60 ,
        }
    }
);

async function sendVerificationEmail(email,otp){
    try {
        const mailResponse = await mailSender(email,"Verification Email from Study Notion",otp);
        console.log("Email Sent Successfully: ",mailResponse);
    } catch (error) {
        console.log("Error occured while sending mail : ",error) ;
        throw error;
    }
}

otpScheema.pre("save",async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next();
})

mongoose.exports = mongoose.model("OTP",otpScheema) ;