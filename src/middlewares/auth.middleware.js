import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User} from "../models/user.model.js";

export const veriftJWT = asyncHandler( async(req, _, next) => {  // if res is empty we can use _  instead of res
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        console.log(token);
        if(!token){
            throw new ApiError(401, "Unauthorize request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken") // changed decodeToken to decoded...
    
        if(!user){
    
            // To look about frontend - we have to do
            throw new ApiError(401,"Invalid Access Token")   
        }
    
        req.user = user;
        next()  // next middleware
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
        
    }
    

    
})