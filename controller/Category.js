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
            message:"All Category Fetched Successfully",
            data:getAllCategories,
            
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

//categoryPageDetails 

exports.categoryPageDetails = async (req, res) => {
    try {
            //get categoryId
            const {categoryId} = req.body;
            //get courses for specified categoryId
            const selectedCategory = await Category.findById(categoryId)
                                            .populate("courses")
                                            .exec();
            //validation
            if(!selectedCategory) {
                return res.status(404).json({
                    success:false,
                    message:'Data Not Found',
                });
            }
            //get coursesfor different categories
            const differentCategories = await Category.find({
                                         _id: {$ne: categoryId},
                                         })
                                         .populate("courses")
                                         .exec();

            //get top 10 selling courses
            //HW - write it on your own

            //return response
            return res.status(200).json({
                success:true,
                data: {
                    selectedCategory,
                    differentCategories,
                },
            });

    }
    catch(error ) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}