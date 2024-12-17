import mongoose from "mongoose";
import DownVoteOpinion from "../models/downvote-opinon.js";
import Opinion from "../models/opinion.js";
import UpVoteOpinion from "../models/upvote-opinion.js";
export const createOpinion = async (req, res) => {
    try {
        const { opinion, campaignId } = req.body
        if (!campaignId || !opinion) {
            return res.status(400).json({
                status: "failed",
                message: "Please provide required fields.",
            })
        }
        const newOpinion = await Opinion.create({
            content: opinion,
            campaign: campaignId
        })

        return res.status(201).json({
            satus: "success",
            message: "Opinion created successfully",
            opinion: newOpinion
        })
    } catch {
        res.status(500).json({
            status: "error",
            message: "something went wrong"
        })
    }
}

export const upVote = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.user?.id || req.user?._id;
        const opinionId = req.params?.id;

        if (!userId || !opinionId) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid input" });
        }

        // Check if the opinion is already upvoted
        const isUpvoted = await UpVoteOpinion.findOne({ user: userId, opinion: opinionId }, null, { session });

        if (isUpvoted) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Already upvoted" });
        }

        // Create a new upvote
        await UpVoteOpinion.create([{ user: userId, opinion: opinionId }], { session });

        // Remove any existing downvote for the same opinion
        const wasDownVoted = await DownVoteOpinion.deleteOne({ user: userId, opinion: opinionId }, { session });
        if (wasDownVoted.deletedCount > 0) {
            await Opinion.findByIdAndUpdate(opinionId, {
                $inc: { downVotes: -1 }
            })
        }
        // Increment `upVotes` count in the Opinion model within the transaction
        await Opinion.findByIdAndUpdate(
            opinionId,
            { $inc: { upVotes: 1 } },
            { session }
        );

        // Commit transaction
        await session.commitTransaction();
        res.status(200).json({ message: "Upvoted successfully" });
    } catch (err) {
        await session.abortTransaction();
        console.log(err)
        res.status(500).json({ message: "Something went wrong", error: err.message });
    } finally {
        // End the session in the finally block to ensure it's always called
        session.endSession();
    }
};


export const downVote = async (req, res) => {
    const session = await mongoose.startSession(); // Start a session
    session.startTransaction(); // Begin the transaction

    try {
        const userId = req.user?.id || req.user?._id; // Validate user
        const opinionId = req.params?.id; // Validate opinion ID

        if (!userId || !opinionId) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid input" });
        }

        // Check if the opinion is already downvoted
        const isDownvoted = await DownVoteOpinion.findOne(
            { user: userId, opinion: opinionId },
            null,
            { session }
        );

        if (isDownvoted) {
            // Abort transaction and return response
            await session.abortTransaction();
            return res.status(400).json({ message: "Already downvoted" });
        }

        // Add a new downvote
        await DownVoteOpinion.create([{ user: userId, opinion: opinionId }], { session });

        // Check and remove any existing upvote for the same opinion
        const wasUpVoted = await UpVoteOpinion.deleteOne({ user: userId, opinion: opinionId }, { session });
        if (wasUpVoted.deletedCount > 0) {
            // Decrement `upVotes` only if an upvote was removed
            await Opinion.findByIdAndUpdate(
                opinionId,
                { $inc: { upVotes: -1 } },
                { session }
            );
        }

        // Increment `downVotes`
        const opinionUpdate = await Opinion.findByIdAndUpdate(
            opinionId,
            { $inc: { downVotes: 1 } },
            { session, new: true }
        );

        if (!opinionUpdate) {
            throw new Error("Opinion not found");
        }

        // Commit the transaction
        await session.commitTransaction();

        res.status(200).json({ message: "Downvoted successfully" });
    } catch (err) {
        // Abort transaction and handle errors
        await session.abortTransaction();
        res.status(500).json({ message: "Something went wrong", error: err.message });
    } finally {
        // End the session
        session.endSession();
    }
};
