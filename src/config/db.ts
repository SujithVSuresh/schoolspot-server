import mongoose from "mongoose";


// const MONGO_URI = process.env.MONGO_URI as string

const connectDB = async () => {
    try{
        await mongoose.connect('mongodb://admin:password@localhost:27017/SCHOOLSPOT?authSource=admin')
        console.log(`🍃 Mongodb connected to Authentication Service`)
    }catch(error){
        console.log(`Error: ${error}`)
    }
}

export default connectDB