const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");

const { updateProfile,
    deleteAccount,
    getAllUserDetails,
    updateDisplayPicture,
    getEnrolledCourses,

} = require("../controller/Profile");
// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
router.delete("/deleteAccount", auth, deleteAccount);//DONE
router.put("/updateProfile", auth, updateProfile);//DONE
router.get("/getAllUserDetails", auth, getAllUserDetails);//DONE
router.put("/updateProfilePicture", auth, updateDisplayPicture);//DONE
router.get("/enrolledCourses", auth , getEnrolledCourses) ;//DONE

module.exports = router ;
