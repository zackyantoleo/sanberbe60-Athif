/*
# src/utils/database.ts
*/
import mongoose from "mongoose";
import { DATABASE_URL } from "./env";

const connect = async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      dbName: "Cluster0",
    });
    console.log("Database connected");

    return "Database connected";
  } catch (error) {
    console.log(error);

    return error;
  }
};

export default connect;
