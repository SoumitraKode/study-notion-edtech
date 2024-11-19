const cloudinary = require('cloudinary').v2

const uploadVideoToCloudinary = async(file,folder)=>{
    const options = {
        folder,
        resource_type :"video",
    } ;
    
    // options.resourse_type = "video"; //dont forget this line  

    return await cloudinary.uploader.upload(file.tempFilePath,options) ;
}
module.exports = uploadVideoToCloudinary ;
// cloudinary.v2.uploader
// .upload("dog.mp4", 
//   { resource_type: "video", 
//     public_id: "dog_closeup",
//     eager: [
//       { width: 300, height: 300, crop: "pad", audio_codec: "none" }, 
//       { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" } ],                                   
//     eager_async: true,
//     eager_notification_url: "https://mysite.example.com/notify_endpoint" })
// .then(result=>console.log(result));