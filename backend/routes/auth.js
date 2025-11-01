import express from 'express'
import {  updateProfile, getUserRole, getUserById, registerUser, loginUser } from '../controller/auth.js'

let authRoute = express.Router()

authRoute.post('/register', registerUser);
authRoute.post('/login', loginUser);
authRoute.put('/profile/:id', updateProfile)
authRoute.get('/user/:id', getUserRole)
authRoute.get('/userData/:id', getUserById)


export default authRoute


