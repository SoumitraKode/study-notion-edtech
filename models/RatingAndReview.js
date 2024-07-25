const mongoose = require("mongoose") ;

const ratingandreviewScheema = new mongoose.Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"user",
        },
        rating:{
            type:Number,
        },
        review:{
            type:String,
            required:true,
        },
        course :{
            type:mongoose.Schema.Types.ObjectId ,
            ref:"Course",
            required:true,
        }
    }
)

module.exports = mongoose.model("RatingAnsReview",ratingandreviewScheema) ;