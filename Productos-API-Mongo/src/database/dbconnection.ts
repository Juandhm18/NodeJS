import mongoose from "mongoose";

const dbconnection = async () =>{
    try {
    const mongodbAtlas = process.env.MONGODB_URI;

if(!mongodbAtlas){
    throw new Error("MONGODB_URI not defined in .env");
}
    await mongoose.connect(mongodbAtlas);

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la BD ver logs');
    }
}

export default dbconnection;