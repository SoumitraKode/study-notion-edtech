//Requirements ==>
    //Auth =>
        const jwt = require("jsonwebtoken") ;

//auth middleware
exports.auth = async(req,res,next)=>{
    try {
        //we first get the token => 3 ways =>1]Req.body(not preffered) 2]Bearer(preferred) 3]cookies
        const token = req.body || req.cookies.body || req.header("Authorisation").replace("Bearer ","") ;
        //cheack if the token is valid
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is Missing",
            })
        }
        //token is valid
        //Get the payload by using verify method
        try {
            const payload = await jwt.verify(token,process.env.JWT_SECREAT) ;
            console.log(payload) ;
            req.user = payload ;
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:"Token is Invalid",
            });
        }

    
    }catch (error) {
        return res.status(401).json({
            success:false,
            message:"Somethig went while validating the token",
        })
    }
};

//student
exports.isStudent = async(req,res,next)=>{
    try {
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is protected Route for Students ONLY",
            })
        }
        // ==>Yei Routes mei likh sakte hai call back funtin=on mei
        // return res.status(200).json({
        //     success:true,
        //     message:""
        // })
    } catch (error) {
        console.log("Issue in account type verification",error) ;
        return res.status().json({
            success:false,
            message :"Issue in acount type verification"
        }
        )
    }
}

//Instructor

exports.isInstructor = async(req,res,next)=>{
    try {
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is protected Route for Instructor ONLY",
            })
        }
        // ==>Yei Routes mei likh sakte hai call back funtin=on mei
        // return res.status(200).json({
        //     success:true,
        //     message:""
        // })
    } catch (error) {
        console.log("Issue in account type verification",error) ;
        return res.status().json({
            success:false,
            message :"Issue in acount type verification"
        }
        )
    }
}

//Admiin

exports.isAdmin = async(req,res,next)=>{
    try {
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is protected Route for Admin ONLY",
            })
        }
        // ==>Yei Routes mei likh sakte hai call back funtin=on mei
        // return res.status(200).json({
        //     success:true,
        //     message:""
        // })
    } catch (error) {
        console.log("Issue in account type verification",error) ;
        return res.status().json({
            success:false,
            message :"Issue in acount type verification"
        }
        )
    }
}