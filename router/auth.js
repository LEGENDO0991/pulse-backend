import { register,login, verifyOtp, checkAuth } from './../controllers/auth.js'
import { isAuthenticated } from './../middlewares/auth.js';

export default (router) => {
    router.post('/api/auth/login', login)
    router.post('/api/auth/register', register)
    router.post('/api/auth/verify-otp', verifyOtp)
    router.post('/api/auth/check', isAuthenticated, checkAuth)
}