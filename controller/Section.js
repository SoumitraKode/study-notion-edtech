const Section = require("../models/Section") ;
const Course = require("../models/Course") ;

//Creating Section
exports.createSection = async (req,res) =>{
    try {
        //Fetch Section Data + Course_id
        //Blur vision of how Course Id came in req.body ==>But before Section  Creation Courseis Created
        const {SectionName,courseId} = req.body ; //Not Sure of name of CourseId

        //Validate Data
        if(!SectionName || !courseId){
            console.log("Section name OR CourseID is absent");
            console.error(error) ;
            return res.status(500).json({
                success:false,
                message:"All Fields are Cumpulsory",
                error:error.message,
            })
        }

        //Create Section Entry in DB
        const newSection = await Section.create({SectionName}) ;

        //Update Section id in Course Scheema
        const UpdatedCourse = await Course.findByIdAndUpdate(
                                                    courseId,{
                                                        $push:{
                                                            courseContent:newSection._id,
                                                        }
                                                    },{new:true},
        )
        .populate({
            path:"courseContent",
            // populate:{
            //     path:"SubSection",  
            // },
        })
        .exec() ;
        //Use of Deep Populate Function ==> https://chatgpt.com/share/cf0b2daf-069b-468b-8e88-0fe8d9668a0e



        //Return Response
        return res.status(200).json({
            success:true,
            message:"Section Created Successfully",
            UpdatedCourse,
        })
    } catch (error) {
        console.log("Error in Section Creation");
        console.error(error) ;
        return res.status(500).json({
            success:false ,
            error:error.message,
        });
    }
}

//Update Section == >
exports.updateSection = async(req,res)=>{
    try {
        //Fetch Data ==>Currently we can only update The Name
        const{sectionId,SectionName} = req.body ;
        
        //Validate
        if(!sectionId || !SectionName){
            return res.status(500).json({
                success:false,
                message:"All Fields are Cumpulsory" ,
                error:message.error,
            });
        }

        //Entry in Db
        const updatedSection = await Section.findByIdAndUpdate(sectionId,
                                                                {
                                                                    SectionName:SectionName
                                                                },
                                                                {new:true},
        ).populate("subSection").exec();
        //Todo ==> IS there a need to delete the reference of this section from course

        //Return res
        return res.status(200).json({
            success:true,
            message:"Section Updated Successfully",
            updatedSection:updatedSection,
        });

    } catch (error) {
        console.log("Unable to Update Scetion");
        console.error(error) ;
        return res.status(500).json({
            success:false,
            message:"Error in Updating the Section",
            error:error.message,
        })
    }
}

//Delete section
exports.deleteSection = async (req,res)=>{
    try {
        //Fetch data => Assuming that id is sent in Params
        //######YOU MIGHT MAKE A MISTAKE HERE BY TAKING IT BY req.body ######
        // const{sectionId} = req.params;
        const{sectionId} = req.body ;

        //Validate Data
        if(!sectionId){
            console.log("Incorret Section Id");
            return res.status(500).json({
                success:false,
                message:"Invalid Section Id",
            })
        }

        //delete
        const deleteResponse = await Section.findByIdAndDelete(sectionId);
        //we have to delete this section ka reference saved in the course content reference array in course scheema
        //==>>
        
        //return res
        return res.status(200).json({
            success:true,
            message:"Section deleted Successfully",
            deleteResponse:deleteResponse,
        });

    } catch (error) {
        console.log("Unable to delete Section");
        console.error(error) ;
        return res.status(500).json({
            success:false,
            message:"Error in Deleting Section",
        }) ;
    }
}