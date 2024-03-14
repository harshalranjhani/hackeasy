import dbConnect from "@/utils/db/dbConnect";
import User from "@/models/User";

import { hash } from "bcryptjs";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  // Connect to database
  const client = await dbConnect("auth");
  const { email } = req.body;

  // Validate email
  if (!email || !email.includes("@")) {
    res.status(422).json({ message: "Invalid Data" });
    return;
  }

  // Check user exists
  const user = await User.findOne({
    email,
    authType: "credentials",
  });

  // Send error response if user is not found
  if (!user) {
    res.status(422).json({ message: "NoUser" });
    return;
  }

  // Generate new password
  const newPassword = Math.random().toString(36).slice(-8);
  // Hash new password
  const hashedPassword = await hash(newPassword, 12);
  // Update user password
  const updatePassRes = await User.updateOne(
    { email, authType: "credentials" },
    { password: hashedPassword }
  );

  if (updatePassRes.modifiedCount !== 1) {
    res.status(500).json({ message: "Something went wrong1 - DB" });
    return;
  }

  // Send email with new password to user with nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.NEXTAUTH_EMAIL,
      pass: process.env.NEXTAUTH_EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.NEXTAUTH_EMAIL,
    to: email,
    subject: "New Password for your account - HackNDash",
    text: `Your new password for HackNDash is: ${newPassword}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.status(500).json({ message: "Something went wrong ! - Mail" });
    }
  });

  res.status(201).json({ message: "New password sent on your email!" });
}
