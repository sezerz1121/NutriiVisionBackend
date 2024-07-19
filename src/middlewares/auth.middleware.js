import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import dotenv from "dotenv"
dotenv.config()

export const verfiyJWT = asyncHandler
( 
    async (req,res,next) =>
    {
       try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
 
        if(!token)
        {
         throw new ApiError(401,"unAuthorized request")
        }
        
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const user =await User.findById(decodedToken?._id).select("-password -refreshToken")
        if(!user)
        {
         throw new ApiError(401,"invalid AccessToken")
        }
        req.user = user;
        next()
       } catch (error) {
         throw new ApiError(401,error?.message||"invalid AccessToken")
       }

    }
)