import jwt from "jsonwebtoken"
import User from "../models/user.js"

export const isAuthenticated = async (req, res, next) => {
    const authorization = req.headers.authorization
    const token = authorization.split(" ")[1]
    if (!authorization) {
        return res.status(403).json({
            status: "failed",
            message: "Unauthorized! Please log in"
        })
    }
    if (!token) {
        return res.status(403).json({
            status: "failed",
            message: "Unauthorized! Please log in 2"
        })
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET)
    if (!decode) {
        return res.status(403).json({
            status: "failed",
            message: "Unauthorized! Please log in"
        })
    }

    const user = await User.findOne({
        email: decode.email
    })
    req.user = {
        email: user.email,
        id: user.id,
        _id: user._id
    }
    next()
}