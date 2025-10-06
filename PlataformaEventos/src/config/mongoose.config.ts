import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbconnection = async () =>{
    try {
    const mongodbAtlas = process.env.MONGO_URL;

if(!mongodbAtlas){
    throw new Error("MONGO_URL not defined in .env");
}
    await mongoose.connect(mongodbAtlas);

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la BD ver logs');
    }
}

export default dbconnection;