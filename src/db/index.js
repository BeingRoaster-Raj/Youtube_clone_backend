import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"; 


const connectDB = async () => {
    try{
// console.log("ENV RAW URL =>", `"${process.env.MONGODB_URL}"`);

        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`\n MongoDBconnected !! DB Host: ${connectionInstance.connection.host}`);
        // ASSIGNMENT ----> iss connectionInstance ko ek baar console.log kar lo to tumhe pata chalega ki ye 
        // ek object return kar raha hai jisme bahut saari information hoti hai jaise ki host, port, dbname etc.
    }catch(error){
        console.log("MONGODB connection error:", error);
        process.exit(1);
    }
}

export default connectDB;