const cloudinary = require("cloudinary");

exports.uploadImageToCloudinary = async(file,folder,height,quality)=>{
    const options = {folder} ;
    if(height){
        options.height = height ;
    }
    if(quality){
        options.quality = quality ;
    }
    options.resourse_type = "auto"; //dont forget this line  

    return await cloudinary.uploader.uploads(file.tempFilePath,options) ;
}