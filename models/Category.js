const mongoose = require("mongoose") ;

const CategoryScheema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
        },
        description:{
            type:Number,
        },
        course:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course",
        }
    }
)

module.exports = mongoose.model("Category",CategoryScheema) ;