import mongoose from "mongoose";
import Campaign from "../models/compaign.js";
import DownVoteCampaign from "../models/downvote-campaign.js";
import UpVoteCampaign from "../models/upvote-campaign.js";

export const getCampaign = async (req, res) => {
    try {
        const { campaignId } = req.params
        const campaign = await Campaign.findById(campaignId)
        res.status(200).json({
            message: "campaigns fetched successfully",
            campaign
        })
    } catch {
        res.status(500).json({
            message: "something went wrong"
        })
    }
}

export const getCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find()
        res.status(200).json({
            message: "campaigns fetched successfully",
            campaigns
        })
    } catch {
        res.status(500).json({
            message: "something went wrong"
        })
    }
}
export const createCampaign = async (req, res) => {
    const { title, description } = req.body
    if (!title || !description) {
        return res.status.json({
            status: "failed",
            message: "Please provide required fields.",
        })
    }

    const newCampaign = await Campaign.create({
        title,
        description
    })

    return res.status(201).json({
        satus: "success",
        message: "Campaign created successfully",
        campaign: newCampaign
    })
}


export const upVote = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.user?.id || req.user?._id;
        const campaignId = req.params?.id;

        if (!userId || !campaignId) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid input" });
        }

        const isUpvoted = await UpVoteCampaign.findOne({ user: userId, campaign: campaignId }, null, { session });

        if (isUpvoted) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Already upvoted" });
        }

        await UpVoteCampaign.create([{ user: userId, campaign: campaignId }], { session });

        const downvote = await DownVoteCampaign.deleteOne({ user: userId, campaign: campaignId }, { session });
        if (downvote) {
            Campaign.findByIdAndUpdate(campaignId, { $inc: { downVotes: -1 } })
        }
        await Campaign.findByIdAndUpdate(
            campaignId,
            { $inc: { upVotes: 1 } },
            { session }
        );

        await session.commitTransaction();
        res.status(200).json({ message: "Upvoted successfully" });
    } catch (err) {
        await session.abortTransaction();
        res.status(500).json({ message: "Something went wrong", error: err.message });
    } finally {
        session.endSession();
    }
};


export const downVote = async (req, res) => {
    const session = await mongoose.startSession(); // Start a session
    session.startTransaction(); // Begin the transaction

    try {
        const userId = req.user?.id || req.user?._id; // Validate user
        const campaignId = req.params?.id; // Validate opinion ID

        if (!userId || !campaignId) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid input" });
        }

        const isDownvoted = await DownVoteCampaign.findOne(
            { user: userId, campaign: campaignId },
            null,
            { session }
        );

        if (isDownvoted) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Already downvoted" });
        }

        await DownVoteCampaign.create([{ user: userId, campaign: campaignId }], { session });

        const upvote = await UpVoteCampaign.findOneAndDelete({ user: userId, campaign: campaignId }, { session });
        if (upvote) {
            await Campaign.findByIdAndUpdate(
                campaignId,
                { $inc: { upVotes: -1 } },
                { session }
            );
        }

        const campaignUpvote = await Campaign.findByIdAndUpdate(
            campaignId,
            { $inc: { downVotes: 1 } },
            { session, new: true }
        );

        if (!campaignUpvote) {
            throw new Error("Opinion not found");
        }

        await session.commitTransaction();

        res.status(200).json({ message: "Downvoted successfully" });
    } catch (err) {
        await session.abortTransaction();
        res.status(500).json({ message: "Something went wrong", error: err.message });
    } finally {
        session.endSession();
    }
};
