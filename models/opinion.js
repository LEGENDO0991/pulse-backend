import mongoose from "mongoose";

const schema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
    },
    campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    downVotes:{
        type:Number,
        default:0
    },
    upVotes:{
        type:Number,
        default:0
    }
}, {
    timestamps: true
})

const Opinion = mongoose.model("Opinion", schema)

export default Opinion