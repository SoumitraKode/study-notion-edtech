const Profile = require("../models/Profile") ;
const User = require("../models/User") ;
const uploadImageToCloudinary = require("../utils/imageUploader") ;
const dotenv = require("dotenv").config() ;

exports.updateProfile = async(req,res) =>{
    try {

        //Fetch Profile Data
        const {gender,dateofBirth,about,contactNo} = req.body ;

        //we have user id in Request body ==> Appended in Middlewares
        const UserId = req.user.id ;

        //Now get the Profile id by using UserId
        const prev_User = await User.findById(UserId) ;

        const ProfileId = prev_User.additionalDetails ;
        //####SIR NE ALAG TYPE SE UPDATE KIYA HAI TOH THIS  CODE MIGHT BR ERRORED

        //Get the Profile by using ProfileId and update it 
        const UpdatedProfile = await Profile.findByIdAndUpdate(ProfileId,
                                                                {
                                                                    gender,dateofBirth,about,contactNo,
                                                                },
                                                                {new:true},
        );

        //we dont need to update anything in User as it stores the refernece of the Profile.

        // Return response
        return res.status(200).json({
            success:true,
            message:"Profile Updated Successfully",
            UpdatedProfile:UpdatedProfile,
        }) ;


    } catch (error) {
        console.log("Unable to Update Profile") ;
        console.error(error) ;
        return res.status(500).json({
            success:false,
            message:"Error in Updating Profile",
        })
    }
}

//deleteaccount
exports.deleteAccount = async (req,res)=>{
    try {
        //get user ID :
        const UserId = req.user.id ;
        console.log("user Id : ",UserId) ;
        
        //Get the user from db
        const ExistingUser = await User.findById(UserId) ; 

        //Validate User Id
        if(!ExistingUser){
            console.log("Invalid user ID") ;
            return res.status(500).json({
                success:false,
                message:"Invalid User Id",
            })
        }

        //Delete the Profile of user ==> Get the Profile ID
        const ProfileId = ExistingUser.additionalDetails ;

        //delete the profile by using Profile ID
        const DeletedProfileRes = await Profile.findByIdAndDelete(ProfileId) ;//SIR ==> _id:ProfileId

        //Delete the User
        const DeletedUserRes = await User.findByIdAndDelete(UserId) ;//SIR ==> _id:UserId

        //Return respose
        return res.status(200).json({
            success:true ,
            message:"User Deleted Successfully",
        })


    } catch (error) {
        console.log("Error in Deleting Account");
        console.error(error) ;

        return res.status(500).json({
            success:false,
            message:"Unable to Delete Account" ,
            error:error.message,
        })
    }
}

exports.getAllUserDetails = async(req,res)=>{
    try {
        //get id
        const UserId = req.user.id ;
        //DB call
        const UserDetails = await User.findById(UserId).populate("additionalDetails").exec() ;

        //return res
        res.status(200).json({
            success:true,
            message:"User Details Fetched Successfully",
            UserDetails:UserDetails,
        })
    } catch (error) {
        console.log("Unable to fetch all User Details") ;
        console.error(error) ;
        return res.status(500).json({
            success:false,
            message:"Error",
        })
    }
}

exports.updateDisplayPicture = async (req,res) =>{
    try {
        ///collect the profile picture from req body file
        console.log("Into Update Function") ;
        const profile_image = req.files.Profile_Image ;
        if(!profile_image){
            return res.status(500).json({
                success:false,
                message:"Upload Valid Image" ,
            });
        }
        //Get the user from the request
        const UserId = req.user.id ; 

        //upload the image to cloudinary
        console.log("Uploading Image : ");
        const uploadResponse = await uploadImageToCloudinary(profile_image, process.env.FOLDER_NAME ,1000,1000) ;
        if(!uploadResponse){
            console.log("Error in Uploading Image") ;
            return res.status(500).json({
                success:false,
                message:"Unable to upload image",
                error:message.error ,
            });
        }
        //get the user using the id
        const updated_User = await User.findByIdAndUpdate({_id:UserId},
            {
                image:uploadResponse.secure_url ,
            },
            {new:true} ,
        );

        return res.status(200).json({
            success:true,
            message:"Profile Picture Updated Successfully",
            User_Scheema:updated_User,
            updated_image:uploadResponse.secure_url,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error to Update Profile Picture",
            error:message.error ,
        });
    }
}

exports.getEnrolledCourses = async (req,res) =>{
    try {
        //fetch the user id form the req body
        const UserId = req.user.id ;

        //get the user
        const userDetails = await User.findById(UserId)
        .populate("courses")
        .exec() ;

        if (!userDetails) {
            return res.status(400).json({
              success: false,
              message: `Could not find user with id: ${userDetails}`,
            })
        }

        return res.status(200).json({
            success: true,
            data: userDetails.courses,
        })

    } catch (error) {
        console.log("Error to fetch Enrolled Courses") ;
        return res.status(500).json({
            success:false,
            message:message.error ,

        });
    }
}