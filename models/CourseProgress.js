const mongoose = require("mongoose") ;

const CourseProgressScheema = new mongoose.Schema(
    {
        courseId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course",
        },
        completedVidoes:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"SubSection",
            }
        ]
    }
);

mongoose.exports = mongoose.model("CourseProgress",CourseProgressScheema) ;