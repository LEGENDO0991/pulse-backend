import mongoose from "mongoose";

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Title is required!"]
    },
    otp:String,
    otpExpiry:Date,
    isBanned: {
        type: Boolean,
        default: false
    }
})

const User = mongoose.model("User", schema)

export default User