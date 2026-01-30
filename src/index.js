// require("dotenv").config({path: './env'});  // ye line environment variables ko load karne ke liye hai


import dotenv from "dotenv"; 
import connectDB from "./db/index.js";
import { app } from "./app.js";


dotenv.config({
    path: './.env'
})
// console.log("MONGO URL =", process.env.MONGODB_URL);
connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server run kar raha hai ! Nacho: ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MongoDB ka wire connection toot gaya hai!! check kar chu**...", err);
})
