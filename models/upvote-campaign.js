import mongoose from "mongoose"
const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: ['true', 'Please provide user id']
    },
    campaign: {
        type: mongoose.Schema.ObjectId,
        ref: 'Campaign',
        required: ['true', 'Please provide opinon id']

    }
})

const UpVoteCampaign = mongoose.model('UpVoteCampaign',schema)
export default UpVoteCampaign