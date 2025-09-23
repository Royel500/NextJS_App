// app/api/auth/action/registerUser.js
'use server'
import dbConnect from "@/app/lib/dbconnect";
import bcrypt from "bcryptjs";

export const registerUser = async (payload) => {
  try {
    const collection = await dbConnect('userCollection');

    // Check if user already exists by email
    const existingUser = await collection.findOne({ email: payload.email });
    console.log("Existing User:", existingUser);

    if (existingUser) {
      return { error: true, message: "User already exists. Please login instead." };
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(payload.password, salt);

    // Replace plain password with hashed password
    const newUser = {
      ...payload,
      password: hashedPassword,
    };

    // Insert new user
    const result = await collection.insertOne(newUser);
    return { success: true, result };

  } catch (error) {
    console.log(error);
    return { error: true, message: "Something went wrong" };
  }
};
