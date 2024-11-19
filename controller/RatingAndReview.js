const RatingAndReviews = require("../models/RatingAndReview") ;
const Course = require("../models/Course");

//Create Rating And Review
exports.createRatingAndReview = async(req,res)=>{
    try {

        //Fetch Data
        const{CourseId,rating, review} = req.body ;
        const UserId = req.user.id ;
        //Validate
        if(!review || !rating || !CourseId){
            return res.status(500).json(
                {
                    success:false,
                    message :"All fields are Required",
                }
            )    
        }
        //check if user is enrolled or not
        const courseDetails = await Course.findOne(
            {_id:CourseId,
            studentsEnrolled: {$elemMatch: {$eq: UserId} },
        });

        if(!courseDetails) {
            return res.status(404).json({
                success:false,
                message:'Student is not enrolled in the course',
            });
        }

        const existingreview = await RatingAndReviews.findOne({
            user:UserId,course:CourseId,
        })

        if(existingreview){
            return res.status(403).json({
                success:false ,
                message:"Course is already Reviewed",
            })
        }

        const newRatingAndReview = await RatingAndReviews.create({
            rating,review,user:UserId,course:CourseId,
        });
        //push new rating in course
        
        const updatedCourseDetails = await Course.findByIdAndUpdate({_id:CourseId},
            {
                $push: {
                    ratingAndReviews: newRatingAndReview._id,
                }
            },
            {new: true});
        console.log(updatedCourseDetails);

        return res.status(200).json({
            success:true,
            message:"Rating and Review Posted Successfully",
        })

        
    } catch (error) {
        console.log("Unable to Rate OR Review");
        console.error(error) ;

        return res.status(500).json({
            success:false,
            message:"Error"
        })
    }
}

//getAverageRating
exports.getAverageRating = async (req, res) => {
    try {
            //get course ID
            const courseId = req.body.courseId;
            //calculate avg rating

            const result = await RatingAndReview.aggregate([
                {
                    $match:{
                        course: new mongoose.Types.ObjectId(courseId),
                    },
                },
                {
                    $group:{
                        _id:null,
                        averageRating: { $avg: "$rating"},
                    }
                }
            ])

            //return rating
            if(result.length > 0) {

                return res.status(200).json({
                    success:true,
                    averageRating: result[0].averageRating,
                })

            }
            
            //if no rating/Review exist
            return res.status(200).json({
                success:true,
                message:'Average Rating is 0, no ratings given till now',
                averageRating:0,
            })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


//getAllRatingAndReviews

exports.getAllRating = async (req, res) => {
    try{
            const allReviews = await RatingAndReview.find({})
                                    .sort({rating: "desc"})
                                    .populate({
                                        path:"user",
                                        select:"firstName lastName email image",
                                    })
                                    .populate({
                                        path:"course",
                                        select: "courseName",
                                    })
                                    .exec();
            return res.status(200).json({
                success:true,
                message:"All reviews fetched successfully",
                data:allReviews,
            });
    }   
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    } 
}