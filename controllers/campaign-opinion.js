import Opinion from "../models/opinion.js";

export const getOpinionsByCampaignId = async (req, res) => {
    try {
        const { campaignId } = req.params
        if (!campaignId) {
            res.json({
                status: "failed",
                message: "Please provide campaign id"
            })
        }
        const opinions = await Opinion.find({
            campaign: campaignId
        })
        res.status(200).json({
            status: "success",
            opinions
        })
    } catch {
        res.status(500).json({
            status: "error",
            message: "Something went wrong"
        })
    }
}