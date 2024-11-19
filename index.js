//initialising React Router
const express = require("express") ;
const app = express() ;

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
// const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");

const databaseConnection = require("./config/database");
databaseConnection.dbConnect() ; //connecttion to DataBase

const cookieParser = require("cookie-parser") ;
const cors = require("cors") ;
//connecttion to cloudinary
const cloudinary = require("./config/cloudinary") ;
cloudinary.cloudinaryConnect();//conection to cloudinary

//file upload configurations
const fileUpload = require("express-fileupload") ;
require("dotenv").config() ;

const PORT = process.env.PORT || 4000 ;

//middlewares 
app.use(express.json()) ;
app.use(cookieParser()) ;


app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true,
    })
)

app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
)

//default routes

//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
// app.use("/api/v1/payment", paymentRoutes);

app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"Your Server is Up and Running:==>",
    })
})

app.listen(PORT,()=>{
    console.log(`App is Running at ${PORT}`) ;
})