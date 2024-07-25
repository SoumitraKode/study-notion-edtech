const mongoose = require("mongoose") ;

const UserScheema = new mongoose.Schema(
    {
        FirstName:{
            type:String,
            required:true,
            trim:true,
        },
        LastName:{
            type:String,
            required:true,
            trim:true,
        },
        email:{
            type:String,
            required:true,
            trim:true,
        },
        active: {
			type: Boolean,
			default: true,
		},
		approved: {
			type: Boolean,
			default: true,
		},
        password:{
            type:String,
            required:true,
        },
        accountType:{
            type:"String",
            enum:["Admin","Student","Instructor"],
            required:true,
        },
        additionalDetails:{
            type:mongoose.Schema.Types.ObjectId ,
            required:true,  
            ref:"Profile",
        },
        courses:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course",
        }],
        image:{
            type:String,
            required:true,
        },
        //Token and resetPassword fields are added for RessetPassword controller
        token:{
            type:String,
        },
        resetPasswordExpires:{
            type:Date,
        },
        courseProgress:[{
            type:mongoose.Schema.TypeError.ObjectId,
            ref:"CourseProgress",
        }],
        
        // Add timestamps for when the document is created and last modified
    },
    {timestampts:true},
);

mongoose.exports = mongoose.model("User",UserScheema) ;