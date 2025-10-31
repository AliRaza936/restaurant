
  import dotenv from 'dotenv';
  import jwt from 'jsonwebtoken';
  import nodemailer from 'nodemailer';
  import { v4 as uuidv4 } from 'uuid';
  import ObjectId from 'bson-objectid'
import  db  from '../database/db.js'
  dotenv.config();


  const JWT_SECRET = process.env.JWT_SECRET ;
  const OTP_EXP_MINUTES = 5;

const mailer = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

  const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

  const sendEmailOtp = async (email, otp) => {
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #d35400;">Spice Palace</h2>
        <p>Dear customer,</p>
        <p>Your OTP code is:</p>
        <h1 style="color: #e67e22;">${otp}</h1>
        <p>This code will expire in ${OTP_EXP_MINUTES} minutes.</p>
        <p>Thank you for choosing Spice Palace 🍛</p>
      </div>
    `;
    return mailer.sendMail({
      from: `"Spice Palace" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your Spice Palace Verification Code',
      html: htmlTemplate,
    });
  };

  // Request OTP
  export const requestOtp = async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).send({ success: false, message: 'Email is required' });
    const id = ObjectId().toHexString()
      const [existing] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
      if (existing.length === 0) {
        // Check if this is the first user (admin)
        const [userCount] = await db.execute('SELECT COUNT(*) as count FROM users');
        const role = userCount[0].count === 0 ? 'admin' : 'user';
        
        await db.execute(
          'INSERT INTO users (id, email, is_verified, role) VALUES (?, ?, ?, ?)',
          [id, email, 0, role]
        );
      }

      const otp = generateOtp();
      const expiresAt = new Date(Date.now() + OTP_EXP_MINUTES * 60 * 1000);

      await db.execute(
        'INSERT INTO otps (id, email, code, expires_at, verified) VALUES (?, ?, ?, ?, ?)',
        [id, email, otp, expiresAt, 0]
      );

      await sendEmailOtp(email, otp);

      res.status(200).send({ success: true, message: 'OTP sent to email' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ success: false, message: 'Server error' });
    }
  };

  // Verify OTP
  export const verifyOtp = async (req, res) => {
    try {
      const { email, code } = req.body;
      if (!email || !code) return res.status(400).send({ success: false, message: 'Email and OTP are required' });

      const [rows] = await db.execute(
        'SELECT * FROM otps WHERE email = ? AND code = ? ORDER BY created_at DESC LIMIT 1',
        [email, code]
      );

      if (rows.length === 0) return res.status(400).send({ success: false, message: 'Invalid code' });
      const otpRow = rows[0];

      if (otpRow.verified) return res.status(400).send({ success: false, message: 'Code already used' });
      if (new Date(otpRow.expires_at) < new Date()) return res.status(400).send({ success: false, message: 'Code expired' });

      await db.execute('UPDATE otps SET verified = 1 WHERE id = ?', [otpRow.id]);
      await db.execute('UPDATE users SET is_verified = 1 WHERE email = ?', [email]);

      const [userRows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
      const token = jwt.sign({ id: userRows[0].id }, JWT_SECRET, { expiresIn: '7d' });

      res.status(200).send({ success: true, message: 'Verified', token, user: { ...userRows[0], id: userRows[0].id, role: userRows[0].role || 'user' } });
    } catch (error) {
      console.error(error);
      res.status(500).send({ success: false, message: 'Server error' });
    }
  };

  // Check if email exists
  export const checkEmail = async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).send({ success: false, message: 'Email is required' });

      const [existing] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
      res.status(200).send({ success: true, exists: existing.length > 0 });
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
