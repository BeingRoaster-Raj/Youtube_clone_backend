import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


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

    if(!username || !email){
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

export { 
    registerUser,
    loginUser,
    logoutUser
 }