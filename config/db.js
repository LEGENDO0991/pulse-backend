import mongoose from "mongoose";

const DB_STRING = process.env.DB_STRING


const connectDB = async () => {
    try {
        await mongoose.connect(DB_STRING);
        console.log("Connected to DB")
    } catch (err) {
        console.log("Error while connecting to DB")
        console.log(err)
        process.exit(1)
    }

}

export default connectDB