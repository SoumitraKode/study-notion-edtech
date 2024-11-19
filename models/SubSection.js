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
        },
        sectionId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section",
            required:true,
        }
    }
);

module.exports = mongoose.model("SubSection",SubSectionScheema) ;