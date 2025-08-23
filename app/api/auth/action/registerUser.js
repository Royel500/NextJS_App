'use server'
import dbConnect from "@/app/lib/dbconnect";

export const registerUser = async (payload) => {
  try {
    const collection = dbConnect('userCollection');

    // Check if user already exists by email
    const existingUser = await collection.findOne({ userEmail: payload.userEmail });
    if (existingUser) {
      // User already exists
      return { error: true, message: "User already exists. Please login instead." };
    }

    // If user does not exist, insert new user
    const result = await collection.insertOne(payload);
    return { success: true, result };
    
  } catch (error) {
    console.log(error);
    return { error: true, message: "Something went wrong" };
  }
};
