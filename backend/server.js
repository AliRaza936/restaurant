import express from 'express'
import dotenv, { config } from 'dotenv'
import productRoute from './routes/product.js'
import categoryRoute from './routes/category.js'
import orderRoute from './routes/order.js'
import analyticsRoute from './routes/analytics.js'
import cors from 'cors'
import fs from 'fs'
import cookieParser from 'cookie-parser'
import authRoute from './routes/auth.js'


let app = express()

dotenv.config()
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:8080", // frontend URL
  credentials: true // allow cookies/auth headers
}));
// ensure uploads dir exists for multer temp storage
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads')
}
app.use('/product',productRoute)
app.use('/category',categoryRoute)
app.use('/order',orderRoute)
app.use('/analytics',analyticsRoute)
app.use('/auth',authRoute)

// Test database connection and create tables on startup

let PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})