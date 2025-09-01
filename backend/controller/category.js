import ObjectId from 'bson-objectid';

import dotenv from 'dotenv';
import  db  from '../database/db.js'
dotenv.config();

let createCategory = async (req,res) => {
    try {
        let {name} = req.body
        
        let [existing] = await db.execute(`SELECT * FROM categories WHERE LOWER(name) = LOWER(?)`,[name])
        
         if (existing.length > 0) {
            return res.status(402).send({ success:false,message: 'Category name already exists' });
        }
           const id = ObjectId().toHexString();
           await db.execute(`INSERT INTO categories (id, name) VALUES (?, ?)`, [id, name]);
  return res.status(201).send({
            success: true,
            message: 'Category created successfully',
            data: { id, name }
        });
    } catch (error) {
         res.status(400).send({
            success: false,
           message:'server error'
        });
    }
}
let allCategory = async (req,res) => {
    try {
        
        
        let [data] = await db.execute(`SELECT * FROM categories`)
        
          
  return res.status(201).send({
            success: true,
           
            result: data
        });
    } catch (error) {
         res.status(400).send({
            success: false,
           message:'server error'
        });
    }
}
let singleCategory = async (req,res) => {
    try {
        let {id} = req.params;
        
        if (!id) {
            return res.status(400).send({
                success: false,
                message: 'Category ID is required'
            });
        }

        let [data] = await db.execute(`SELECT * FROM categories WHERE id = ?`,[id])
        
          
  return res.status(201).send({
            success: true,
            result: data[0]
        });
    } catch (error) {
         res.status(400).send({
            success: false,
           message:'server error'
        });
    }
}
let deleteCategory = async (req,res) => {
    try {
        let {id} = req.params;
        
        if (!id) {
            return res.status(400).send({
                success: false,
                message: 'Category ID is required'
            });
        }

        let [data] = await db.execute(`SELECT * FROM categories WHERE id = ?`,[id])
        
        if (data.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'Category not found'
            });
        }
         await db.execute(`DELETE FROM categories WHERE id = ?`,[id])

        
          
  return res.status(201).send({
            success: true,
            message:"category delete successfully",
            
        });
    } catch (error) {
         res.status(400).send({
            success: false,
           message:'server error'
        });
    }
}
let updateCategory = async (req,res) => {
    try {
        let {id} = req.params;
        let {name} = req.body;


        
        if (!id) {
            return res.status(400).send({
                success: false,
                message: 'Category ID is required'
            });
        }
           const [existingCategory] = await db.execute(
            `SELECT * FROM categories WHERE id = ?`,
            [id]
        );

        if (existingCategory.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'Category not found'
            });
        }

        let [data] = await db.execute(`SELECT * FROM categories WHERE id = ?`,[id])
        
        if (data.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'Category not found'
            });
        }
         const [duplicate] = await db.execute(
            `SELECT * FROM categories WHERE LOWER(name) = LOWER(?) AND id != ?`,
            [name, id]
        );

        if (duplicate.length > 0) {
            return res.status(409).send({
                success: false,
                message: 'Category name already exists'
            });
        }

          await db.execute(
            `UPDATE categories SET name = ? WHERE id = ?`,
            [name, id]
        );
 const [updatedCategory] = await db.execute(
            `SELECT * FROM categories WHERE id = ?`,
            [id]
        );
        return res.status(200).send({
            success: true,
            message: 'Category updated successfully',
            result:updatedCategory[0]
        });

    } catch (error) {
         res.status(400).send({
            success: false,
           message:'server error'
        });
    }
}
export {createCategory,allCategory,singleCategory,deleteCategory,updateCategory};