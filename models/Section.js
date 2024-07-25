const mongoose = require("mongoose") ;

const SectionScheema = new mongoose.Schema(
    {
        SectionName:{
            type:String,
            required:true,
        },
        subSection:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"SubSection",
            required:true,
        }]


    }
);

mongoose.exports = mongoose.model("Section",SectionScheema) ;