const Category = require("../models/Category");


exports.createCategory = async (req,res)=>{
    try {
        const{name,description} = req.body ;

        if(!name){
            return res.status(500).json({
                success:false,
                message:"All Fields are Cumpolsory",
            });
        }

        const newCategory = await Category.create({
            name,description,
        });
        console.log(newCategory) ;
        return res.status(200).json(
            {
                success:true,
                message:"Category Created Successfully",
            }
        );  

    } catch (error) {
        console.log("Error in Creating Category") ;
        console.error(error) ;
        return res.status(500).json({
            success:false,
            message:error,

        })
    }
}

exports.getAllCategories = async (req,res)=>{
    try {
        const getAllCategories = await Category.find({},
            {name:true,description:true},
        );

        return res.status(200).json({
            success:true,
            data:getAllCategories,
            message:"All Category Fetched Successfully",
        })
    } catch (error) {
        console.log("Unable to Fetch all Category");
        console.error(error) ;

        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}