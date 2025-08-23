'use server'
import dbConnect from "@/app/lib/dbconnect";

export const registerUser = async (payload) => {
  try {
    const collection = dbConnect('userCollection');
    const result = await collection.insertOne(payload);
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
};
