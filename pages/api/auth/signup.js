import { hash } from "bcryptjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

import dbConnect from "@/utils/db/dbConnect";
import User from "@/models/User";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  // Connect to database
  const client = await dbConnect("auth");
  const { name, email, password, role } = req.body;

  // Validate
  if (!email || !email.includes("@") || password.length < 6 || !name) {
    res.status(422).json({ message: "Invalid Data" });
    return;
  }

  // Check existing
  const checkExisting = await User.findOne({
    email,
    authType: "credentials",
  });

  // Send error response if duplicate user is found
  if (checkExisting) {
    res.status(422).json({ message: "AlreadyUser" });
    return;
  }

  // Hash password
  const hashedPassword = await hash(password, 12);
  const userObj = {
    name,
    email,
    password: hashedPassword,
    authType: "credentials",
    role: role || "user",
  };

  // insert in database
  const insertRes = await User.create(userObj);

  const userId = insertRes._id;
  const userEmail = email;

  // generate verification token
  const token = jwt.sign(
    { id: userId },
    process.env.NEXTAUTH_SECRET + userEmail,
    {
      expiresIn: "1d",
    }
  );
  const verificationLink = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}&email=${userEmail}`;

  // send verification link to user email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.NEXTAUTH_EMAIL,
      pass: process.env.NEXTAUTH_EMAIL_PASSWORD,
    },
    from: process.env.NEXTAUTH_EMAIL,
  });

  const mailOptions = {
    from: process.env.NEXTAUTH_EMAIL,
    to: email,
    subject: "Email Verification - HackNDash",
    text: `Verify your email by clicking on this link: ${verificationLink}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return res.status(500).json({ message: "Something went wrong ! - Mail" });
    }
  });
  // Send success response
  return res.status(201).json({
    message: "Verification Email Sent! Check your inbox or spam folder.",
  });
}
