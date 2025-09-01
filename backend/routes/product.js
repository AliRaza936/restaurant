import express from 'express'
import {upload} from '../middleware/upload.js'
import { allProducts, createProduct, deleteProduct, getTotalProducts, singleProduct, updateProduct } from '../controller/product.js'

let productRoute = express.Router()

productRoute.get('/all', allProducts)
productRoute.get('/single/:id', singleProduct)
productRoute.post('/create', upload.single('image'), createProduct)
productRoute.put('/update/:id', upload.single('image'), updateProduct)
productRoute.delete('/delete/:id', deleteProduct)
productRoute.get('/total', getTotalProducts);

export default productRoute