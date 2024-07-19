import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";
import  dotenv  from "dotenv";
dotenv.config();

cloudinary.config({ 
  cloud_name:`${process.env.cloud_name}` , 
  api_key: `${process.env.api_key}`, 
  api_secret: `${process.env.api_secret}` 
});

const uploadOnCloudinary = async (localFilePath) => 
{
    try {
        if(!localFilePath) return null;

        const response= await cloudinary.uploader.upload(localFilePath,
        {
            resource_type: "auto"
        })
        // file has been upload succesfully
        // console.log("file has been upload succesfully",response.secure_url);
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null;
    }
}


export {uploadOnCloudinary};