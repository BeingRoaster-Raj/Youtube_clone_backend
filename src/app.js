import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"   
// cookieparser => it used only for to access or set cookise of user's browser to perform CRED Operation
// because there are few ways from where you keep secure cookies in user's browser 
// and those cookis are read and remove only by server.


const app = express()

// middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,

    // explore karna hai Task -> CTRL + Space
}))
// jab json se request aaya tab ye kaam aayega aur isme bhi limit hai
// form bharne ke baad ka data aayega -> example hai
app.use(express.json({limit: "16kb"}))

// jab url se data aaye wo bhi chaiye hoga

app.use(express.urlencoded({extended: true, limit: "16kb"}))  // waise toh extended ka jarurat nahi hai but wo objects ke andar aur objects de sakte hai -> more nested objects

// if aapke server pe pdf, images,videos aapke hi server pe rakhna hai toh static use hota hai
// ye ke public folder raheega koi bhi access kar lega 
app.use(express.static("public"))

app.use(cookieParser())



// routes import

import userRouter from "./routes/user.routes.js"

// route declaration
// app.use("/users", userRouter)    // we are calling by using milldeware

app.use("/api/v1/users", userRouter)

// http://localhost:8000/api/v1/users/register

export { app };