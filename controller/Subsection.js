const SubSection = require("../models/SubSection") ;
const Section = require("../models/Section");
const uploadImageToCloudinary = require("../utils/imageUploader");
const uploadVideoToCloudinary = require("../utils/videoUploader");

//Creating Sub-Section
// exports.createSubsection = async (req,res)=>{
//     try {
//         //Fetch data
//         const{title, description,sectionId} = req.body ;
//         //Fetch video file ==>import thr utils 
//         const video = req.files.VideoFile ;

//         //Validate it
//         if(!title || !video || !description || !sectionId){
//             return res.status(500).json({
//                 success:false,
//                 message:"All Fields are Required",
//             });
//         }
//         console.log(video) ;

//         //Upload it 
//         //Remember the syntax
//         const UploadResponse = await uploadVideoToCloudinary(video,process.env.FOLDER_NAME) ;
//         console.log("Upload details :",UploadResponse);
//         //create entry in db
//         const newSubsection = await SubSection.create({
//             title,
//             timeDuration:`${UploadResponse.duration}`,
//             description,
//             videoUrl:UploadResponse.secure_url,
//             sectionId:sectionId,
//         }) ;
//         console.log("newSubsection : "+ newSubsection);
//         //updating this reference in section
//         const parent_Section = await Section.findByIdAndUpdate({_id:sectionId},{
//             $push:{
//                 SubSection:newSubsection._id,
//             }
//         },
//         {new:true},
//         ).populate("subSection");
        
//         console.log("Parent Section : "+parent_Section);
        
//         // const updatedSection = await Section.findByIdAndUpdate(sectionId,
//         //                                                         {
//         //                                                             $push:{
//         //                                                                 subSection:newSubsection._id ,
//         //                                                             }
//         //                                                         },
//         //                                                         {new:true},
//         // )
//         // .populate("subSection").exec() ;
//         //return response
//         return res.status(200).json({
//             success:true,
//             message:"Subsection created Successfully",
//             SubSection:newSubsection,
//             updatedSection:parent_Section, 
//         })

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             success:false,
//             message:"Error in creating section",
//             error:error.message,
//         })
//     }
// }
exports.createSubsection = async (req, res) => {
    try {
        const { title, description, sectionId } = req.body;
        const video = req.files.VideoFile;

        if (!title || !video || !description || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const uploadResponse = await uploadVideoToCloudinary(video, process.env.FOLDER_NAME);

        const newSubsection = await SubSection.create({
            title,
            timeDuration: `${uploadResponse.duration}`,
            description,
            videoUrl: uploadResponse.secure_url,
            sectionId,
        });

        const parent_Section = await Section.findByIdAndUpdate(
            sectionId,
            { $push: { subSection: newSubsection._id } },
            { new: true },
        ).populate("subSection");;

        return res.status(200).json({
            success: true,
            message: "Subsection created successfully",
            SubSection: newSubsection,
            updatedSection: parent_Section,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error in creating subsection",
            error: error.message,
        });
    }
};


//Update Subsection == >
exports.updateSubsection = async (req,res)=>{
    try {
        //Fetch Data ==>Currently we can only update The Name
        const{title , description,subSectionId} = req.body ;
        
        if(!subSectionId){
            return res.status(400).json({
                success:false,
                message:"Subsection Id is neccessary :",
            });
        }
        const Subsection = await SubSection.findOne({_id:subSectionId});
        //Validate
        if (title !== undefined) {
            Subsection.title = title
        }
      
        if (description !== undefined) {
            Subsection.description = description
        }
        // if(!title || !description){
        //     return res.status(500).json({
        //         success:false,
        //         message:"All Fields are Cumpulsory" ,
                
        //     });
        // }

        //Entry in Db
        // const updatedSubsection = await Section.findByIdAndUpdate(subSectionId,
        //                                                         {
        //                                                             title:title,
        //                                                             timeDuration:timeDuration,
        //                                                             description:description, 
        //                                                         },
        //                                                         {new:true},
        // );
        //Todo ==> IS there a need to delete the reference of this section from course
        if (req.files && req.files.video !== undefined) {
            const video = req.files.video
            console.log("Uploading Video File :");
            const uploadDetails = await uploadVideoToCloudinary(
              video,
              process.env.FOLDER_NAME
            )
            console.log("Video File Uploaded Sucessfully :");
            Subsection.videoUrl = uploadDetails.secure_url
            Subsection.timeDuration = `${uploadDetails.duration}`
          }
      
        await Subsection.save()
        //Return res
        return res.status(200).json({
            success:true,
            message:"Subsection Updated Successfully",
            updated_Subsection:Subsection,
        });

    } catch (error) {
        console.log("Unable to Update Subsection");
        console.error(error) ;
        return res.status(500).json({
            success:false,
            message:"Error in Updating the Subsection",
            error:error.message,
        }) ;
    }
}

//Delete section
exports.deleteSubsection = async (req,res)=>{
    try {
        //Fetch data => Assuming that id is sent in Params
        //######YOU MIGHT MAKE A MISTAKE HERE BY TAKING IT BY req.body ######
        const {subSectionId} = req.body;

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
        //we have to delete this subsection ka reference saved in the section  reference array in section scheema
        //==>>
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