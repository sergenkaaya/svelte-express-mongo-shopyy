import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI; // create .env file to root add your MongoDB connection string as MONGODB_URI
    await mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .catch((error) => console.log(error));
    const connection = mongoose.connection;
    console.log("MongoDB -- OK");
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default connectDB;