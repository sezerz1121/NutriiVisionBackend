import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { History } from "../models/history.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { pdf } from "../utils/PDF.js";
import { GoogleGenerativeAI } from '@google/generative-ai';
import mime from 'mime';
import fs from 'fs';
import dotenv from "dotenv";
dotenv.config();

const Scan = asyncHandler
(
    async (req,res) =>
    {
        const {userId} = req.body;

         const Existuser = await User.findOne({ _id: userId });

        if(!Existuser)
        {
            throw new ApiError(404,"user does not exist");
        }
        const imageLocalPath = req.files?.imageScan[0]?.path;
        if(!imageLocalPath)
        {
            throw new ApiError(400, " image file is required");
        }
        const genAI = new GoogleGenerativeAI(process.env.GAPI_KEY);

        function fileToGenerativePart(path) {
            const mimeType = mime.getType(path);
            return {
              inlineData: {
                data: Buffer.from(fs.readFileSync(path)).toString("base64"),
                mimeType
              },
            };
          }

        const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "you Specialize in Food Recognition: identify food, provide nutritional info, and suggest recipes and provide youtube lastest videos must provide link in this way(https://www.youtube.com/results?search_query=addtitle)and make link clickable. format must be (This looks like food name. Nutritional Information (per serving): Recipe Suggestions: YouTube Videos: Enjoy your meal!)and give in html in <div className='Text-box'> br ui ul <a  target=_blank>";

        const imagePart = fileToGenerativePart(imageLocalPath); 

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = await response.text();

        if(!result)
        {
            throw new ApiError(404,"someting went wrong in result")
        }
        if(!response)
        {
                throw new ApiError(404,"response error")
        }
        if(!text)
        {
                    throw new ApiError(404,"text not genrated")
        }

        const imageUpload = await uploadOnCloudinary(imageLocalPath);

        const history =await History.create
        (
           {
               user:userId,
               image:imageUpload.secure_url,
               text:text
           }
        )

        const createdHistory =await History.findById(history._id)

        if(!createdHistory)
        {
           throw  new ApiError(500,"someting went wrong");
        }

       return res.status(201).json
       (
           new ApiResponse(200,createdHistory.text)
       )


    }
)

export 
{
 Scan
}
