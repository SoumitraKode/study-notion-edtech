//Requirements ==>
    //Auth =>
        const jwt = require("jsonwebtoken") ;
require("dotenv").config() ;
//auth middleware
exports.auth = async(req,res,next)=>{
    try {
        //we first get the token => 3 ways =>1]Req.body(not preffered) 2]Bearer(preferred) 3]cookies
        // TokenArray = jwttoken.split(" ");
        const token = req.cookies.token 
                        || req.body.token 
                        || req.header("Authorisation").replace("Bearer ", "");
        
        // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNvdW1pdHJha29kZTIyQGdtYWlsLmNvbSIsImFjY291bnRUeXBlIjoiU3R1ZGVudCIsImlkIjoiNjczYWE3YmU4MzY5YjIyODQwYTcwM2MxIiwiaWF0IjoxNzMxOTAzOTIxLCJleHAiOjE3MzE5OTAzMjF9.FQD4JeJ_kFeDGl9gYGFOY6cSxilFXTC5orauFs00dC4";

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
            console.log("Recived Token :"+token);
            const payload = jwt.verify(token, process.env.JWT_SECRET) ;
            console.log(payload) ;
            req.user = payload ;
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:"Token is Invalid",
            });
        }
        console.log("Authentication Successfull : ");
        next() ;
    
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
        console.log("in IsStudent middleware : ");
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is protected Route for Students ONLY",
            })
        }
        console.log("isStudent middleware Complete : ");
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
        console.log("in IsInstructor middleware : ");
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is protected Route for Instructor ONLY",
            })
        }
        console.log("isInstructor middleware Complete : ");
        // ==>Yei Routes mei likh sakte hai call back funtin=on mei
        // return res.status(200).json({
        //     success:true,
        //     message:""
        // })
        next();
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
        console.log("in isAdmin middleware : ");
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is protected Route for Admin ONLY",
            })
        }
        console.log("isAdmin middleware Complete : ");
        next();
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

