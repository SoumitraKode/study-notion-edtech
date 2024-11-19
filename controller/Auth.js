//OTP Generation
// const mongoose = require("mongoose") ;
const OTP = require("../models/OTP");
const otpgenerator = require("otp-generator");
//SignUp Scheema
const User = require("../models/User");
const Profile = require("../models/Profile");
const bcrypt = require("bcrypt");
const mailSender = require("../utils/mailSender");
const passwordUpdated = require("../mail/templates/passwordUpdate");
//sign Scchema
const jwt = require("jsonwebtoken");
const { FaHashnode } = require("react-icons/fa6");
require("dotenv").config();


//OTP=>Controller
// Send OTP For Email Verification
exports.OTP_Generator = async (req, res) => {
	try {
		const { email } = req.body;

		// Check if user is already present
		// Find user with provided email
		const checkUserPresent = await User.findOne({ email:email });
		// to be used in case of signup

		// If user found with provided email
		if (checkUserPresent) {
			// Return 401 Unauthorized status code with error message
			return res.status(401).json({
				success: false,
				message: `User is Already Registered`,
			});
		}

		var otp = otpgenerator.generate(6, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});
		const result = await OTP.findOne({ otp: otp });
		console.log("Result is Generate OTP Func");
		console.log("OTP", otp);
		console.log("Result", result);
		while (result) {
			otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
			});
		}
		const otpPayload = { email:email, otp:otp };
		const otpBody = await OTP.create(otpPayload);
		console.log("OTP Body", otpBody);
		res.status(200).json({
			success: true,
			message: `OTP Sent Successfully`,
			otp,
		});
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ success: false, error: error.message });
	}
};

//Sign Up constroller
exports.SignUp = async (req, res) => {
    try {
        //Import the data from request body
        const {
            FirstName,
            LastName,
            email,
            password,
            accountType,
            contactNo,
            otp,
            confirmPassword,
        } = req.body;

        //validation
        if (!FirstName || !LastName || !email || !password || !accountType || !contactNo || !otp || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields",
            })
        }
        //check if existing user exist
        const prevUser = await User.findOne({ email });

        if (prevUser) {
            return res.status(403).json({
                success: false,
                message: "User with Email already Exist",
            })
        }
        // Check if password and confirm password match
		if (password !== confirmPassword) {
			return res.status(400).json({
				success: false,
				message:
					"Password and Confirm Password do not match. Please try again.",
			});
		}

        // Find the most recent OTP for the email
		const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
		console.log(response);
		if (response.length === 0) {
			// OTP not found for the email
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		} else if (otp !== response[0].otp) {
			// Invalid OTP
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		}


        //incrypt the password
        let hasedpassword = ""; 
        try {
            console.log("Into Hashing Password :") ;
            hasedpassword = await bcrypt.hash(password, 10);
            console.log("Hashed Password : "+hasedpassword) ;
        } catch (error) {
            console.log("issuse in hashing password : ", error);

            return res.status(500).json({
                success: false,
                message: "Issuse in hashing password",
            })
        }
        //generating image by their name . 
        console.log("generating image : ");
        const image = `https://ui-avatars.com/api/?name=${FirstName}+${LastName}`;
        console.log(image) ;
        //Creating Profile => As we will require its _id in the User Scchema .

        // Create the user
        console.log("Verifying Account Type : ") ;
		let approved = false  ;
		accountType === "Instructor" ? (approved = true) : (approved = false);
        console.log("Creating New Profile : ") ;
        const new_Profile = await Profile.create({
            gender: null,
            dateofBirth: null,
            about: null,
            contactNo: contactNo    ,
        }); 
        // 1] => Course aur course Progress  nahi diya hai !!! 
        console.log("Creating New User : "+new_Profile) ;
        const new_User = await User.create({
            FirstName:FirstName,
            LastName:LastName,
            email:email,
            active:true,
            approved,
            password:hasedpassword,
            accountType:accountType,
            additionalDetails:new_Profile._id,
            image:image,
        })
        //send the resposnse
        return res.status(200).json({
            success: true,
            message: "User Created Succssfully"
        });
    } catch (error) {
        console.log("Issue in User Creation : ", error.meassage);
        return res.status(500).json({
            success: false,
            
            message: "Somethig went wrong while created User ",
        })
    }
};

//sign in controller
exports.SignIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        
        //cheack if user exist or not =>
        const prev_User = await User.findOne({ email });
        //if user does not exist
        
        if (!prev_User) {
            console.log("User doesnot exist");
            return res.status(400).json({
                success: false,
                message: "User does not exist",
            }); 
        }
        
        //now mathch the passowrds
        if (await bcrypt.compare(password, prev_User.password)) {
            
            //generate token =>1]create Payloaod
            const payload = {
                email: prev_User.email,
                accountType: prev_User.accountType,
                id: prev_User._id ,
            };
            // console.log(payload);
            
            const token = await jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "24h",
            });
            console.log(token);
            console.log("Over here");
            prev_User.token = token;
            prev_User.password = undefined;
            //now send cookie=>{"name of token",actual token,options==>Very Important} ;
            const options = {
                expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }   
            return res.cookie("token", token, options).status(200).json({
                success: true,
                token: token,
                prev_User,
                meassage: "Loggedin Successfully",
            });

        } else {
            return res.status(401).json({
                success: false,
                message: "Incorrect Password",
            });
        }

    } catch (error) {
        console.log("Issue in Logging in : ", error);
        return res.status(500).json({
            success: false,
            message: "Issue in Logging you In ",
        })
    }
}

// Controller for Changing Password
exports.changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword, confirmNewPassword } = req.body;

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
        console.log("Old Password verification :" +isPasswordMatch);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

		// Match new password and confirm new password
		if (newPassword !== confirmNewPassword) {
			// If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.FirstName} ${updatedUserDetails.LastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};