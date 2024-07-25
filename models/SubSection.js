const mongoose = require("mongoose") ;

const SubSectionScheema = new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
        },
        timeDuration:{
            type:String,
        },
        description:{
            type:String,
            trim:true,
        },
        videoUrl:{
            type:String,
             
        },
        additionalUrl:{
            type:String,
        }


    }
);

mongoose.exports = mongoose.model("SubSection",SubSectionScheema) ;