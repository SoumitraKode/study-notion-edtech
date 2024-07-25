const SubSection = require("../models/SubSection") ;
const Section = require("../models/SubSection") ;
const uploadImageToCloudinary = require("../utils/imageUploader") ;


//Creating Sub-Section
exports.createSubsection = async (req,res)=>{
    try {
        //Fetch data
        const{title,timeDuration , description,sectionId} = req.body ;
        //Fetch video file ==>import thr utils 
        const video = req.files.VideoFile ;
        //Validate it
        if(!title || !timeDuration || !description || !sectionId){
            return res.status(500).json({
                success:false,
                message:"All Fields are Required",
            });
        }
        //Upload it 
        //Remember the syntax
        const UploadResponse = await uploadImageToCloudinary(video,process.env.FOLDER_NAME) ;
        //create entry in db
        const newSubsection = await SubSection.create({title,timeDuration,description,videoUrl:UploadResponse.secure_url}) ;
        //updating this reference in section
        const updatedSection = await Section.findByIdAndUpdate(sectionId,
                                                                {
                                                                    $push:{
                                                                        subSection:newSubsection._id ,
                                                                    }
                                                                },
                                                                {new:true},
        ).populate("Subsection").exec() ;
        
        //return response
        return res.status(200).json({
            success:true,
            message:"Subsection created Successfully",
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error in creating section"
        })
    }
}


//Update Subsection == >
exports.updateSubsection = async(req,res)=>{
    try {
        //Fetch Data ==>Currently we can only update The Name
        const{title,timeDuration , description,subSectionId} = req.body ;
        
        //Validate
        if(!title || !timeDuration || !description){
            return res.status(500).json({
                success:false,
                message:"All Fields are Cumpulsory" ,
                error:message.error,
            });
        }

        //Entry in Db
        const updatedSubsection = await Section.findByIdAndUpdate(subSectionId,
                                                                {
                                                                    title:title,
                                                                    timeDuration:timeDuration,
                                                                    description:description, 
                                                                },
                                                                {new:true},
        );
        //Todo ==> IS there a need to delete the reference of this section from course

        //Return res
        return res.status(200).json({
            success:true,
            message:"Subsection Updated Successfully",
        });

    } catch (error) {
        console.log("Unable to Update Subsection");
        console.error(error) ;
        return res.status(500).json({
            success:false,
            message:"Error in Updating the Subsection",
            error:error.message,
        })
    }
}

//Delete section
exports.deleteSubsection = async (req,res)=>{
    try {
        //Fetch data => Assuming that id is sent in Params
        //######YOU MIGHT MAKE A MISTAKE HERE BY TAKING IT BY req.body ######
        const{subSectionId} = req.params;

        //Validate Data
        if(!subSectionId){
            console.log("Incorret Subsection Id");
            return res.status(500).json({
                success:false,
                message:"Invalid Subsection Id",
            })
        }

        //delete
        const deleteResponse = await SubSection.findByIdAndDelete(subSectionId);

        //return res
        return res.status(200).json({
            success:true,
            message:"Subsection deleted Successfully",
        });

    } catch (error) {
        console.log("Unable to delete Subsection");
        console.error(error) ;
        return res.status(500).json({
            success:false,
            message:"Error in Deleting Subsection",
        }); 
    }
}