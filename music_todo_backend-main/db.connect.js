import mongoose from "mongoose";

const dbName = process.env.DB_NAME;
const dbPass = encodeURIComponent(process.env.DB_PASSWORD);
const dbUserName = process.env.DB_USERNAME;

export const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${dbUserName}:${dbPass}@cluster0.nawyyok.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`
    );

    console.log("DB connection established...");
  } catch (error) {
    console.log("DB connection failed...");
    console.log(error.message);
  }
};
