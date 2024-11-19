const express = require("express") ;
const router = express.Router() ;

//import all the controllers
    //1] Course Contoller
const{createCourse,
    showAllCourses,
    getCourseDetails} = require("../controller/Course") ;


    //2] Categorires Contoller
const{createCategory,
    getAllCategories,
    categoryPageDetails,} =require("../controller/Category") ;
    //3]Section Controller
const{
    createSection,
    updateSection,
    deleteSection,} = require("../controller/Section") ;
    //4]Sub_section Controller

const{createSubsection,
    updateSubsection,
    deleteSubsection,}=require("../controller/Subsection");

    //5]Rating Controller
const{createRatingAndReview,
    getAverageRating,
    getAllRating} = require("../controller/RatingAndReview") ;

    //6]Importing Middleware
const{auth,
    isStudent,
    isInstructor,
    isAdmin} =require("../middleware/auth") ;
// const router = require("../ClassCodes/server 7/server/routes/Course");/

/* -------------------------------------------------------------------------------------------- */
                                    // Course Routes
/* -------------------------------------------------------------------------------------------- */
//Only Instructor can create Course
router.post("/createCourse",auth,isInstructor,createCourse) ;//done
//Add Sectionto Course
router.post("/addSection",auth,isInstructor,createSection) //done
router.post("/updateSection", auth, isInstructor, updateSection)//done
// Delete a Section
router.delete("/deleteSection", auth, isInstructor, deleteSection)//done
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubsection)//done
// Delete Sub Section
router.delete("/deleteSubSection", auth, isInstructor, deleteSubsection)//done
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubsection)//done
// Get all Registered Courses
router.get("/getAllCourses", showAllCourses)//done
// Get Details for a Specific Courses
router.get("/getCourseDetails", getCourseDetails)//done

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory)//DONE
router.get("/showAllCategories", getAllCategories)//DONE
router.post("/getCategoryPageDetails", categoryPageDetails)//IMP

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRatingAndReview)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)

module.exports = router