import jwt from "jsonwebtoken";
import User from './../models/user.js';
import sendEmail from "../services/email.js";
import bcrypt from "bcrypt"
import { generateOTP, validEmail } from "../utils/index.js";

export const register = async (req, res, next) => {
    const { email } = req.body
    if (!validEmail(email)) {
        return res.status(400).json({
            status: "failed",
            message: "Invalid email"
        })
    }

    const user = await User.findOne({ email })
    if (user) {
        return res.status(400).json({
            status: "failed",
            message: "Email already registered"
        })
    }

    const newUser = await User.create({ email })
    const otp = generateOTP()
    const hashedOtp = await bcrypt.hash(otp, 10)
    await User.findOneAndUpdate({ email }, {
        otpExpiry: Date.now() + 10 * 60 * 1000,
        otp: hashedOtp
    })

    sendEmail({
        to: email,
        message: `Your otp for sign Up is ${otp}`,
        subjectL: "OTP for sign up"
    })

    res.status(200).json({
        status: "success",
        message: "Otp sent to your email",
        email: newUser.email
    })

}

export const login = async (req, res, next) => {
    const { email } = req.body
    if (!validEmail(email)) {
        return res.status(400).json({
            status: "failed",
            message: "Invalid email"
        })
    }

    const user = await User.findOne({ email })
    if (!user) {
        console.log("User does not exist")
        return res.status(400).json({
            status: "failed",
            message: "Email not registered"
        })
    }
    const otp = generateOTP()
    const hashedOtp = await bcrypt.hash(otp, 10)

    await User.findOneAndUpdate({ email }, {
        otpExpiry: Date.now() + 10 * 60 * 1000,
        otp:hashedOtp
    })

    sendEmail({
        to: email,
        message: `Your otp for sign Up is ${otp}`
    }, () => console.log("Error in sending email"))

    res.status(200).json({
        status: "success",
        message: "Otp sent to your email",
        email
    })

}

export const verifyOtp = async (req, res, next) => {
    const { email, otp } = req.body
    if (!email || !otp) {
        return res.status(400).json({
            status: "failed",
            message: "missing required fields"
        })
    }
    const user = await User.findOne({
        email,
        otpExpiry: { $gt: Date.now() }
    })
    if (!user || !await bcrypt.compare(otp, user.otp)) {
        return res.status(400).json({
            status: "failed",
            message: "Invalid otp or time out"
        })
    }
    const token = jwt.sign({ email }, process.env.JWT_SECRET)

    res.status(200).json({
        status: "success",
        token,
        message: "Logged in"
    })
}

export const checkAuth = async (req, res) => {
    return res.status(200).json({ user: req.user})
}