import mongoose from "mongoose"
const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: ['true', 'Please provide user id']
    },
    opinion: {
        type: mongoose.Schema.ObjectId,
        ref: 'Opinion',
        required: ['true', 'Please provide opinon id']

    }
})

const UpVoteOpinion = mongoose.model('UpvoteOpinion',schema)
export default UpVoteOpinion