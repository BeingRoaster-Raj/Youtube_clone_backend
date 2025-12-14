// require("dotenv").config({path: './env'});  // ye line environment variables ko load karne ke liye hai


import dotenv from "dotenv"; 
import connectDB from "./db/index.js";


dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server run kar raha hai ! Nacho: ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MongoDB ka wire connection toot gaya hai!! check kar chu**...", err);
})










// sare code db ke index.js me shift kar diye hai for better structure and organization

/*
import express from "express";
// 1st approach
// const connectDB = async () => {}


 // 2nd approach
// function connectDB() {}


// connectDB();


// 3rd approach or best approach
// humne ek concept padha tha javascript mai jo tha ified function

;( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)   // ye mongoose ka connect function hai jo humne async await ke sath use kiya hai
        app.on("error", (error) =>{    // ye express se baat karne ka ya phir listenning ka function hai
            console.log("ERROR: ", error);
            throw error;  //jab baat hi nahi kar raha to error throw kar denge
        })

        app.listen(process.env.PORT, () => {   // ye express ka listen function hai jo humne port ke sath use kiya hai
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    }
    catch (error) {
        console.log("ERROR:", error);
    }
})()    // ye ek ified function hai jisme humne async await use kiya hai /// aur semicolon lagaya hai taki agar koi aur code ho to wo isse affect na ho
*/
