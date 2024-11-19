const mongoose = require("mongoose") ;

const ProfileScheema = new mongoose.Schema(
    {
        gender:{
            type:String,
        },
        dateofBirth:{
            type:String,
        },
        about:{
            type:String,
            trim:true,
        },
        contactNo:{
            type:String,
            trim:true,  
        }


    }
);

module.exports = mongoose.model("Profile",ProfileScheema) ;