import express from 'express'
import { allCategory, createCategory, deleteCategory, singleCategory, updateCategory } from '../controller/category.js';

let categoryRoute = express.Router()

categoryRoute.post('/create',createCategory);
categoryRoute.get('/all',allCategory);
categoryRoute.get('/single/:id',singleCategory);
categoryRoute.delete('/delete/:id',deleteCategory);
categoryRoute.put('/update/:id',updateCategory);

export default categoryRoute