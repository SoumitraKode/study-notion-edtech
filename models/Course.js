const mongoose = require("mongoose") ;

const CourseScheema = new mongoose.Schema(
    {
        courseName:{
            type:String,
        },
        courseDescription:{
            type:String,
        },
        Instructor:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        whatYouWillLearn:{
            type:String,
        },
        courseContent:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section",
        }],
        ratingAndReviews:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"RatingAndReview",
        }]  ,
        price:{
            type:Number,
            required:true,
        },
        thumbNail:{
            type:String,
        },
        tag:{
            type: [String],
            required: true,
        },
        category:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Category",
        },
        studentsEnrolled:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                required:true,
            }
        ],
        instructions: {
            type: [String],
        },
        status: {
            type: String,
            enum: ["Draft", "Published"],
        },

    }
);

module.exports = mongoose.model("Course",CourseScheema) ;