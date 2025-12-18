import { v2 as cloudinary } from 'cloudinary';
import { log } from 'console';
import { response } from 'express';
import fs from 'fs'  // fs-file system module->to handle files in nodejs-> read, write, delete files

// we will create a function which will upload file to cloudinary and will return the url of that file 


    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });
    
    // Upload an image
     const uploadOnCloudinary = async (localFilePath) => {
        try{
            if(!localFilePath) return null
            // upload file on cloudinary
           const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto"
            })
            // file uploaded successfully
            console.log("File uploaded successfully", response.url);
            fs.unlinkSync(localFilePath)
            return response;
        }catch(error){
            fs.unlinkSync(localFilePath); // remove file from local uploads folder as the upload failed
            console.log("Error while uploading file on cloudinary", error);
            return null;
        }
     }

     export { uploadOnCloudinary };
         