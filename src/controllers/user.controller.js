import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { json } from "express";


const generateAccessAndRefreshToken = async(userId) => {
   try{
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }

   } catch(error){
       throw new ApiError(500, "Error in generating Access and Refresh tokens")
   }
}
const registerUser = asyncHandler( async(req, res) => {
    // get user details from frontend
    // validation have to do - not empty
    // Check if user already exist: by username or email
    // Check for images, check for avatar
    // upload them to cloudinary, avatar
    // Crate user object - create entry in db
    // Remove password and refresh token field from response
    // check for user creation
    // return response(res)

    // console.log("req.body:", req.body);
    // console.log("req.files:", req.files);

    const { fullName, email, username, password} = req.body     // data coming from "Form and json"
    // console.log("Received fields:", { fullName, email, username, password });
    // you can print all the details like fullname, password, username and all

    if(
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required");   
    }
    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    })
    if(existingUser){
        throw new ApiError(409, "User already exists with this email or username")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

     if(!avatar){
        throw new ApiError(400, "Avatar file is required");
    }

    const user =await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user" )
    }
    
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully!!!")
    )

})

const loginUser = asyncHandler( async(req, res) => {
    // req.body se email and password le lo ya data le lo
    // username or email se user ko dhundo
    // agar user nahi mila to error throw karo
    // agar mila to password ko check karo
    // agar password match nahi kiya to error throw karo
    // agar match kar gaya to access token and refresh token generate karo
    // refresh token ko db me save kar do
    // response me access token bhej do
    // send cokkie with refresh token

    const {email, username, password} = req.body
    console.log(email);

    if(!username && !email){
        throw new ApiError(400, "Username or email is required to Login")
    }

    const user =await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new ApiError(404, "User does not exist with this username or email")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select(" -password -refreshToken")

    // when you are sending cookie from backend to frontend, then you have to set some options

    const options = {
        httpOnly: true,
        secure: true   // only on https
    }

    return res.status(200).cookie("accessToken",accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            { 
                user: loggedInUser, accessToken, refreshToken 
            },
            "User logged in successfully!!"
        )
    )


})

const logoutUser = asyncHandler( async(req, res) => {
    // 1. clear the cookies
    // if  we use email or username to logout then any one can logout user just by knowing email or username
    // so we have middleware to authenticate user using jwt token

    await User.findByIdAndUpdate(
        req.user._id, 
        {
            $set: {
            refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

     const options = {
        httpOnly: true,
        secure: true   // only on https
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully!!"))
 
})

const refreshAccessToken = asyncHandler( async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized request - Token is required");
    }

   try {
     const decodedToken = jwt.verify(
         incomingRefreshToken,
         process.env.REFRESH_TOKEN_SECRET
     )
 
     const user = await User.findById( decodedToken?._id)
 
     if(!user){
         throw new ApiError(401,"Invalid Refresh Token")
     }
 
     if(incomingRefreshToken !== user?.refreshToken){
         throw new ApiError(401,"Refresh Token is expired or used")
     }
 
     const options = {
         httpOnly: true,
         secure: true   // only on https
     }
     const { accessToken, newrefreshToken } = await generateAccessAndRefreshToken(user._id)
 
     return res
     .status(200)
     .cookie("accessToken", accessToken, options)
     .cookie("refreshToken", newrefreshToken, options)
     json(
         new ApiResponse(
             200,
             { accessToken, refreshToken: newrefreshToken },
             "Access token refreshed successfully"
         )
     )
   } catch (error) {
     throw new ApiError(401, error?.message || "Invalid refresh token")
   }
})

const changeCurrentUserPassword = asyncHandler( async(req, res) => {
    const { oldPassword, newPassword } = req.body

    // if i have to apply confirm password then
    // const { oldPassword, newPassword, confirmPassword } = req.body
    // if(!(confirmPassword === newPassword)){
    //     throw new ApiError(400, "New password and confirm password do not match")
    //}
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400, "Old password is incorrect")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})


const getCurrentUser = asyncHandler(async(req, res) =>{
    return res
    .status(200)
    .json(200, req.user, "Current user fetched Successfully")
})


const updateAccountDetails = asyncHandler(async(req, res) =>{
    const {fullName, email} = req.body

    if(!fullName || !email){
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
           $set: {
               fullName,
               email : email
           }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "User account details updated successfully"))
})

const updateUserAvatar = asyncHandler(async(req, res) =>{
    const avatarLocalPath = req.file?.path

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(400, "Error in uploading avatar image")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"))
})

const updateUserCoverImage = asyncHandler(async(req, res) =>{
    const coverImageLocalPath = req.file?.path

    if(!coverImageLocalPath){
        throw new ApiError(400, "Cover image file is required")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!coverImage.url){
        throw new ApiError(400, "Error in uploading cover image")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image updated successfully"))
})

export { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentUserPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage
 }