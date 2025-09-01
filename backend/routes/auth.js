import express from 'express'
import { requestOtp, verifyOtp, updateProfile, checkEmail, getUserRole, getUserById } from '../controller/auth.js'

let authRoute = express.Router()

authRoute.post('/request-otp', requestOtp)
authRoute.post('/verify-otp', verifyOtp)
authRoute.post('/check-email', checkEmail)
authRoute.put('/profile/:id', updateProfile)
authRoute.get('/user/:id', getUserRole)
authRoute.get('/userData/:id', getUserById)


export default authRoute


