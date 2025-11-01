
  import dotenv from 'dotenv';
  import jwt from 'jsonwebtoken';
  import nodemailer from 'nodemailer';
  import { v4 as uuidv4 } from 'uuid';
  import ObjectId from 'bson-objectid'
import  db  from '../database/db.js'
  dotenv.config();


import bcrypt from 'bcryptjs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ObjectId from 'bson-objectid';
import db from '../database/db.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).send({ success: false, message: 'Email and password required' });
    }

    // Check if user exists
    const [existing] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).send({ success: false, message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const id = ObjectId().toHexString();
    const createdAt = new Date(); // current timestamp

    await db.execute(
      'INSERT INTO users (id, full_name, email, password, is_verified, role, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, name, email, hashedPassword, 1, role || 'user', createdAt]
    );

    const token = jwt.sign({ id, role: role || 'user' }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).send({ success: true, message: 'User registered successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Server error' });
  }
};




// User Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).send({ success: false, message: 'Email and password are required' });
    }

    // Check if user exists
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).send({ success: false, message: 'User not found' });
    }

    const user = users[0];



    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ success: false, message: 'Incorrect password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Return success
    res.status(200).send({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Server error' });
  }
};

  // Update profile
  export const updateProfile = async (req, res) => {
    try {
      const { id } = req.params;
      const { fullName, address, city, postalCode } = req.body;

      await db.execute(
        'UPDATE users SET full_name = ?, address = ?, city = ?, postal_code = ? WHERE id = ?',
        [fullName || null, address || null, city || null, postalCode || null, id]
      );

      const [userRows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
      res.status(200).send({ success: true, result: userRows[0] });
    } catch (error) {
      res.status(500).send({ success: false, message: 'Server error' });
    }
  };

  // Get user role by ID
export const getUserRole = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({ success: false, message: "User ID is required" });
    }

    const [rows] = await db.execute(
      'SELECT id, role FROM users WHERE id = ? LIMIT 1',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    res.status(200).send({
      success: true,
      user: {
        id: rows[0].id,
        role: rows[0].role || 'user',
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Server error" });
  }
};
// Get user data by ID (excluding password)
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).send({ success: false, message: "User ID is required" });

    const [rows] = await db.execute(
      `SELECT id, email, full_name, address, city, postal_code, role, is_verified
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    const user = rows[0];

    res.status(200).send({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Server error" });
  }
};
