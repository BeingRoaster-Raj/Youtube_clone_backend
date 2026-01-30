import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"; 


const connectDB = async () => {
    try{
// console.log("ENV RAW URL =>", `"${process.env.MONGODB_URL}"`);

        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}`);
        console.log(`\n MongoDBconnected !! DB Host: ${connectionInstance.connection.host}`);
    }catch(error){
        console.log("MONGODB connection error:", error);
        process.exit(1);
    }
}

export default connectDB;