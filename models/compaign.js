import mongoose from "mongoose";

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required!"]
    },
    description: {
        type: String,
        required: [true, "Description is required!"]
    },
    downVotes: {
        type: Number,
        default: 0
    },
    upVotes: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

schema.virtual('opinionsCount', {
    ref: 'Opinion',
    localField: "_id",
    foreignField: "campaign",
    count: true,
})

schema.pre(/^find/, function (next) {
    this.populate("opinionsCount");
    next(); 
});

const Campaign = mongoose.model("Campaign", schema)

export default Campaign