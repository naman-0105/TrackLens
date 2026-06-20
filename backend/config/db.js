import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("MONGO_URI is not defined. Please add it to your .env file.");
    process.exit(1);
  }

  try {
    mongoose.set("strictQuery", true);

    const connection = await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
    });

    console.log(
      `MongoDB Connected: ${connection.connection.host}/${connection.connection.name}`,
    );

    mongoose.connection.on("error", (error) => {
      console.error("MongoDB connection error:", error.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });
  } catch (error) {
    console.error(`Failed to connect to MongoDB: ${error.message}`);

    process.exit(1);
  }
};

export default connectDB;
