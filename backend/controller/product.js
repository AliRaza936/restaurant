import ObjectId from 'bson-objectid'

import dotenv from 'dotenv'
import cloudinary from '../utils/cloudinary.js'
import fs from 'fs/promises'
import  db  from '../database/db.js'
dotenv.config()

// Helper to remove local temp file
const removeLocalFile = async (filePath) => {
  if (!filePath) return
  try {
    await fs.unlink(filePath)
  } catch {}
}
let createProduct = async (req, res) => {
  try {
    const { name, description, categoryId, price, isFeatured, variants, variantMode } = req.body;
    const file = req.file;

    if (!name || !categoryId) {
      await removeLocalFile(file?.path);
      return res.status(400).send({ success: false, message: 'name and category are required' });
    }

    // Parse variants if they come as FormData string
    let parsedVariants = [];
    if (variants) {
      try {
        parsedVariants = Array.isArray(variants) ? variants : JSON.parse(variants);
      } catch {
        return res.status(400).send({ success: false, message: 'Invalid variants JSON' });
      }
    }

    // Optional image upload
    let imageUrl = null;
    let imagePublicId = null;
    if (file?.path) {
      const uploadRes = await cloudinary.uploader.upload(file.path, {
        folder: 'restaurant/products',
      });
      imageUrl = uploadRes.secure_url;
      imagePublicId = uploadRes.public_id;
      await removeLocalFile(file.path);
    }

    const productId = ObjectId().toHexString();
    const isFeaturedValue =
      typeof isFeatured !== 'undefined' &&
      (String(isFeatured).toLowerCase() === 'true' || String(isFeatured) === '1')
        ? 1
        : 0;

    // Determine base price for products table
    // If price provided, use it; else if variants exist, use min variant price; else 0
    const minVariantPrice = parsedVariants.length
      ? Math.min(
          ...parsedVariants
            .map(v => Number(v?.price))
            .filter(n => !Number.isNaN(n))
        )
      : undefined;

    const basePrice = !Number.isNaN(Number(price)) && price !== undefined && price !== ''
      ? Number(price)
      : (typeof minVariantPrice === 'number' ? minVariantPrice : 0);

    // ✅ FIXED SQL: correct column list and placeholders
    await db.execute(
      `INSERT INTO products (id, name, description, categoryId, price, is_featured, image_url, image_public_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [productId, name, description || null, categoryId, basePrice, isFeaturedValue, imageUrl, imagePublicId]
    );

    // Insert variants (optional)
    if (parsedVariants.length) {
      if (variantMode !== 'size' && variantMode !== 'pieces') {
        return res.status(400).send({ success: false, message: 'variantMode must be "size" or "pieces"' });
      }

      for (const v of parsedVariants) {
        const variantId = ObjectId().toHexString();
        const variantPrice = Number(v?.price);
        if (Number.isNaN(variantPrice)) {
          return res.status(400).send({ success: false, message: 'Variant price must be a number' });
        }

        const size = variantMode === 'size' ? (v?.value || null) : null;
        const pieces = variantMode === 'pieces' ? (v?.value ? Number(v.value) : null) : null;

        await db.execute(
          `INSERT INTO product_variants (id, productId, size, pieces, price)
           VALUES (?, ?, ?, ?, ?)`,
          [variantId, productId, size, pieces, variantPrice]
        );
      }
    }

    return res.status(201).send({
      success: true,
      message: 'Product created successfully',
      result: {
        id: productId,
        name,
        description,
        categoryId,
        price: basePrice,
        isFeatured: !!isFeaturedValue,
        imageUrl,
        imagePublicId,
        variantMode: variantMode || null,
        variants: parsedVariants || [],
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'server error' });
  }
};


let allProducts = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        p.id AS productId, 
        p.name, 
        p.description, 
        p.categoryId, 
        p.price, 
        p.is_featured, 
        p.image_url, 
        p.image_public_id, 
        p.created_at,
        v.id AS variantId,
        v.size, 
        v.pieces, 
        v.price AS variantPrice
      FROM products p
      LEFT JOIN product_variants v ON p.id = v.productId
      ORDER BY p.created_at DESC
    `)

    // Group variants under their product
    const productsMap = {}
    rows.forEach(row => {
      if (!productsMap[row.productId]) {
        productsMap[row.productId] = {
          id: row.productId,
          name: row.name,
          description: row.description,
          categoryId: row.categoryId,
          price: row.price,
          isFeatured: !!row.is_featured,
          imageUrl: row.image_url,
          imagePublicId: row.image_public_id,
          createdAt: row.created_at,
          variants: []
        }
      }
      if (row.variantId) {
        productsMap[row.productId].variants.push({
          id: row.variantId,
          size: row.size,
          pieces: row.pieces,
          price: row.variantPrice
        })
      }
    })

    const products = Object.values(productsMap)
    return res.status(200).send({ success: true, result: products })
  } catch (error) {
    console.log(error)
    return res.status(500).send({ success: false, message: 'server error' })
  }
}

let singleProduct = async (req, res) => {
  try {
    const { id } = req.params
    const [rows] = await db.execute(`
      SELECT 
        p.id AS productId, 
        p.name, 
        p.description, 
        p.categoryId, 
        p.price, 
        p.is_featured, 
        p.image_url, 
        p.image_public_id, 
        p.created_at,
        v.id AS variantId,
        v.size, 
        v.pieces, 
        v.price AS variantPrice
      FROM products p
      LEFT JOIN product_variants v ON p.id = v.productId
      WHERE p.id = ?
    `, [id])

    if (rows.length === 0) {
      return res.status(404).send({ success: false, message: 'Product not found' })
    }

    const product = {
      id: rows[0].productId,
      name: rows[0].name,
      description: rows[0].description,
      categoryId: rows[0].categoryId,
      price: rows[0].price,
      isFeatured: !!rows[0].is_featured,
      imageUrl: rows[0].image_url,
      imagePublicId: rows[0].image_public_id,
      createdAt: rows[0].created_at,
      variants: []
    }

    rows.forEach(row => {
      if (row.variantId) {
        product.variants.push({
          id: row.variantId,
          size: row.size,
          pieces: row.pieces,
          price: row.variantPrice
        })
      }
    })

    return res.status(200).send({ success: true, result: product })
  } catch (error) {
    console.log(error)
    return res.status(500).send({ success: false, message: 'server error' })
  }
}




let updateProduct = async (req, res) => {

  try {
    const { id } = req.params;
    let { name, description, price, categoryId, isFeatured, variants } = req.body;
    const file = req.file;
console.log(isFeatured)
    // Parse variants (can arrive as JSON string via multipart/form-data)
    let parsedVariants = [];
    if (variants) {
      if (typeof variants === 'string') {
        try {
          parsedVariants = JSON.parse(variants);
        } catch (e) {
          return res.status(400).send({ success: false, message: 'Invalid variants JSON' });
        }
      } else if (Array.isArray(variants)) {
        parsedVariants = variants;
      }
    }

   

    // Check product
    const [existingRows] = await db.execute(`SELECT * FROM products WHERE id = ?`, [id]);
    if (existingRows.length === 0) {
      if (file?.path) await removeLocalFile(file.path);
      await db.rollback();
      return res.status(404).send({ success: false, message: 'Product not found' });
    }
    const existing = existingRows[0];

    // Handle image (Cloudinary)
    let imageUrl = existing.image_url;
    let imagePublicId = existing.image_public_id;
    if (file?.path) {
      if (imagePublicId) {
        try { await cloudinary.uploader.destroy(imagePublicId); } catch {}
      }
      const uploadRes = await cloudinary.uploader.upload(file.path, { folder: 'restaurant/products' });
      imageUrl = uploadRes.secure_url;
      imagePublicId = uploadRes.public_id;
      await removeLocalFile(file.path);
    }

   const isFeaturedNum = Number(isFeatured);
const nextIsFeatured = isNaN(isFeaturedNum) ? existing.is_featured : isFeaturedNum;

    // Update main product
    await db.execute(
      `UPDATE products 
       SET name = ?, description = ?, price = ?, categoryId = ?, is_featured = ?, image_url = ?, image_public_id = ?
       WHERE id = ?`,
      [
        name ?? existing.name,
        description ?? existing.description,
        typeof price === 'undefined' ? existing.price : price,
        categoryId ?? existing.categoryId,
        nextIsFeatured,
        imageUrl,
        imagePublicId,
        id,
      ]
    );

    // Delete all old variants and re-insert new ones (value -> size, pieces -> NULL)
    // Always delete; if no variants sent, the product ends up with 0 variants
    await db.execute(`DELETE FROM product_variants WHERE productId = ?`, [id]);

    if (Array.isArray(parsedVariants) && parsedVariants.length > 0) {
      for (const v of parsedVariants) {
        const variantId = ObjectId().toHexString();;
        const size = v.size ?? v.value ?? null;  // your UI sends { value, price }
        const pieces = v.pieces ?? null;         // stays null for size-based variants
        const priceNum = Number(v.price) || 0;

        await db.execute(
          `INSERT INTO product_variants (id, productId, size, pieces, price) VALUES (?, ?, ?, ?, ?)`,
          [variantId, id, size, pieces, priceNum]
        );
      }
    }



    // Return updated product + variants
    const [updatedProduct]  = await db.execute(`SELECT * FROM products WHERE id = ?`, [id]);
    const [updatedVariants] = await db.execute(`SELECT * FROM product_variants WHERE productId = ?`, [id]);

    return res.status(200).send({
      success: true,
      message: 'Product updated successfully',
      result: {
        ...updatedProduct[0],
        variants: updatedVariants,
      },
    });

  } catch (error) {
    
    console.error(error);
    return res.status(500).send({ success: false, message: 'server error' });
  } 
};




let deleteProduct = async (req, res) => {
 
  try {
    const { id } = req.params;

    const [rows] = await db.execute(`SELECT * FROM products WHERE id = ?`, [id]);
    if (rows.length === 0) {
      return res.status(404).send({ success: false, message: 'Product not found' });
    }
    const product = rows[0];

    // Delete image from Cloudinary
    if (product.image_public_id) {
      try { await cloudinary.uploader.destroy(product.image_public_id); } catch {}
    }

    // Delete variants first
    await db.execute(`DELETE FROM product_variants WHERE productId = ?`, [id]);

    // Delete product
    await db.execute(`DELETE FROM products WHERE id = ?`, [id]);

    return res.status(200).send({ success: true, message: 'Product and variants deleted successfully' });

  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: 'server error' });
  } 
};
let getTotalProducts = async (req, res) => {
  try {
    // Total products
    const [totalRows] = await db.execute(`SELECT COUNT(*) AS totalProducts FROM products`);
    const totalProducts = totalRows[0].totalProducts;

    // Total featured products
    const [featuredRows] = await db.execute(`SELECT COUNT(*) AS totalFeatured FROM products WHERE is_featured = 1`);
    const totalFeatured = featuredRows[0].totalFeatured;

    // Optional: total variants
    const [variantRows] = await db.execute(`SELECT COUNT(*) AS totalVariants FROM product_variants`);
    const totalVariants = variantRows[0].totalVariants;

    return res.status(200).send({
      success: true,
      result: {
        totalProducts,
        totalFeatured,
        totalVariants,
      }
    });
  } catch (error) {
    console.error('Error fetching total products:', error);
    return res.status(500).send({ success: false, message: 'Server error' });
  }
};



export { createProduct, allProducts, singleProduct, updateProduct, deleteProduct,getTotalProducts }
