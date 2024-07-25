//OTP Generation
const OTP = require("../models/OTP");
const otpgenerator = require("otp-generator");
//SignUp Scheema
const User = require("../models/User");
const Profile = require("../models/Profile");
const bcrypt = require("bcrypt");
//sign Scchema
const jwt = require("jsonwebtoken");
require("dotenv").config();


//OTP=>Controller
exports.OTP_Generator = async (req, res) => {
    try {
        //get email from the request body
        const { email } = req.body;

        //generate the otp
        let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
        //validate if any pre OTP model in DataBAse
        const prevotp = await OTP.find({ email: email, otp: otp }); 

        //while we get an OTP with same otp and email mapped , we create new otp for that email.
        while (prevotp && prevotp.otp === otp) {
            otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
            //now cheak if any OTP with same otp
            prevotp = await OTP.find({ email: email, otp: otp });
        }
        //now we will create entry in the DB for the new OTP .
        const new_OTP = await OTP.create({
            email, otp: otp,
        });
        //now return response
        return res.status(200).json({
            success: true,
            opt:new_OTP.otp ,
            message: "OTP generated Successfully",
        });
    } catch (error) {
        console.log("issue in OTP Generation : ", error);
        return res.status(500).json({
            success: false,
            message: "Issue in OTP Generation",
        })
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
        try {
            let hasedpassword = await bcrypt.hash(password, 10);
        } catch (error) {
            console.log("issuse in hashing password : ", error);

            return res.status(500).json({
                success: false,
                message: "Issuse in hashing password",
            })
        }
        //generating image by their name . 

        const image = `https://ui-avatars.com/api/?name=${FirstName}+${LastName}`;

        //Creating Profile => As we will require its _id in the User Scchema .

        // Create the user
		let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);

        const new_Profile = await Profile.create({
            gender: null,
            dateofBirth: null,
            about: null,
            contactNo: null,
        }); 
        // 1] => Course aur course Progress  nahi diya hai !!! 
        const new_User = await User.create({
            FirstName,
            LastName,
            email,
            contactNo,
            password: hasedpassword,
            accountType,
            approved: approved,
            additionalDetails: new_Profile._id,
            image: image,
        })
        //send the resposnse
        return res.status(200).json({
            success: true,
            message: "User Created Succssfully"
        });
    } catch (error) {
        console.log("Issue in User Creation : ", error);
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

            const token = await jwt.sign(payload, process.env.JWT_SECREAT, {
                expiresIn: "24h",
            });
            prev_User.token = token;
            prev_User.password = undefined;
            //now send cookie=>{"name of token",actual token,options==>Very Important} ;
            const options = {
                expiresIn: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
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