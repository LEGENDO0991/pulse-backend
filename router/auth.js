import { register,login, verifyOtp, checkAuth } from './../controllers/auth.js'
import { isAuthenticated } from './../middlewares/auth.js';
import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message:"Too many attempts please try again after 5 minutes"
})

export default (router) => {
    router.post('/api/auth/login', limiter,login)
    router.post('/api/auth/register',limiter, register)
    router.post('/api/auth/verify-otp',limiter, verifyOtp)
    router.post('/api/auth/check', isAuthenticated, checkAuth)
}
