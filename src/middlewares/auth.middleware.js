import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { User} from "../models/user.model";

export const veriftJWT = asyncHandler( async(req, _, next) => {  // if res is empty we can use _  instead of res
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!token){
            throw new ApiError(401, "Unauthorize request")
        }
    
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken.userId).select("-password -refreshToken")
    
        if(!user){
    
            // To look about frontend - we have to do
            throw new ApiError(401,"Invalid Access Token")   
        }
    
        req.user = user;
        next()    // to go to next middleware or controller(ref. user.routes.js)
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
        
    }
    

    
})