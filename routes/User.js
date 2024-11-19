// Import the required modules
const express = require("express") ;
const router = express.Router()

// Import the required controllers and middleware functions
const{
    OTP_Generator,
    SignUp,
    SignIn,
    changePassword,
} = require("../controller/Auth") ;

const {auth} = require("../middleware/auth") ;

const {resetPassword,resetPasswordToken} = require("../controller/ResetPassword") ;

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************
console.log({ OTP_Generator, SignUp, SignIn, changePassword, auth, resetPassword, resetPasswordToken });

// Route for user login
router.post("/login", SignIn)//DONE

// Route for user signup
router.post("/signup", SignUp)//DONE

// Route for sending OTP to the user's email
router.post("/sendotp", OTP_Generator)//DONE

// Route for Changing the password
router.post("/changepassword", auth, changePassword)//DONE

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************


// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)//DONE

// Route for resetting user's password after verification

router.post("/reset-password", resetPassword)//DONE

// Export the router for use in the main application
module.exports = router ;