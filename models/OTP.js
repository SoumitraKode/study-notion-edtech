    const mongoose  = require("mongoose") ;
    const mailSender = require("../utils/mailSender") ;
    console.log(mailSender)
    const otpTemplate = require("../mail/templates/emailVerificationTemplate");
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
            const template = otpTemplate(otp) ;
            const mailResponse = await mailSender(email,"Verification Email from Study Notion",template);
            console.log("Email Sent Successfully: ",mailResponse);
        } catch (error) {
            console.log("Error occured while sending mail : ",error) ;
            throw error;
        }
    }

    otpScheema.pre("save",async function(next){
        // await sendVerificationEmail(this.email,this.otp);
        // Only send an email when a new document is created
        if (this.isNew) {
            await sendVerificationEmail(this.email, this.otp);
        }
        
        next();
    })

    module.exports = mongoose.model("OTP",otpScheema) ;