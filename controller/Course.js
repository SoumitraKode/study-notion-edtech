const Course = require("../models/Course");
const Category = require("../models/");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");


exports.createCourse = async (req,res)=>{
    try {
        //As you are cerating a Course So you have logged in =>Now we can access the payload As Pre middleware is executed
        //Fetch Data
        const {courseName,courseDescription,whatYouWillLearn,price,tag,category,status,instructions} = req.body ;
        const thumbnail = req.files.thumbnailImage ; 

        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail || !category || !status || !instructions){
            return res.status(400).json({
                success:false,
                message:"All Fields are required",
            });
        }

        //check for instructor
        const userId = req.user.id ;
        const InstructorDetails = await User.findById(userId) ;
        console.log("Istructor Details",InstructorDetails) ;

        if(!InstructorDetails){
            return res.status(404).json({
                success:false,
                message:"Instructor Details Not Found",
            })
        }

        const CategoryDetails = await Category.findById(Category);
        if(!CategoryDetails){
            return res.status(404).json({
                success:false,
                message:"Category Deatils Not Found",
            });
        }

        //upload To Cloudinary
        const thumbnail_res = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME) ;
        //create entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor:InstructorDetails._id,
            whatYouWillLearn:whatYouWillLearn,
            price,
            category:CategoryDetails._id,
            thumbnail:thumbnail_res.secure_url ,
            tag:tag,
            status:status,
            instructions:instructions,
        });
        //add new course to the user scheema of instructor
        await User.findByIdAndUpdate(
            {_id:InstructorDetails._id},
            {
                $push:{
                    courses:newCourse._id ,
                }
            },
            {new:true},
        
        )

        // Add the new course to the Categories
		await Category.findByIdAndUpdate(
			{ _id: category },
			{
				$push: {
					course: newCourse._id,
				},
			},
			{ new: true }
		);

        return res.status(200).json({
            success:true,
            message:"Course Created Successfully",
            data:newCourse,
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to Create Course",
            error:error.message ,
        });
    }
}

exports.showAllCourses = async(req,res)=>{
    try {
        const AllCourses = await Course.find({},{
            courseName:true,
            price:true,
            thumbnail:true,
            instructor:true,
            ratingAndReviews:true,
            studentsEnrolled:true,
        }) 
        .populate("instructor")
        .exec();

        return res.status(200).json({
             success:true,
             message:"Data for all courses Fetched SuccessFully",
             data:AllCourses,
        })
    
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Cannot Fetch Course Data",
            error:error.message,    
        })
    }
}

//Get  course details
exports.getCourseDetails = async(req,res)=>{
    try {   
        //fetch id
        const{courseId} = req.body ;
        //validate id
        const CourseDetails = await Course.findById(courseId)
                                                        .populate({
                                                            path:'Instructor',
                                                            populate:{
                                                                path:'additionalDetails',
                                                            }
                                                        })
                                                        .populate({
                                                            path:'courseContent',
                                                            path:{
                                                                path:'subSection',
                                                            }
                                                        })
                                                        .populate({
                                                            path:'ratingAndReviews',
                                                        })
                                                        .populate({
                                                            path:'tag',
                                                        })
                                                        .populate({
                                                            path:'studentsEnrolled'
                                                        })
                                                        .exec();

        if(!CourseDetails){
            return res.status(500).json({
                success:false,
                message:"Invalid Course ID",
            })
        }

        
    } catch (error) {
        console.log("Error in Fetching course detatils");
        console.error(error) ;
        return res.status(500).json({
            success:false,
            message:"Error in Fetching course details",
        })
    }
}