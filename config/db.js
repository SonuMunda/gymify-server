const { mongoose } = require("mongoose");

const URI = `mongodb+srv://${process.env.MONGODB_ADMIN}:${process.env.MONGODB_ADMIN_PASSWORD}@cluster0.csk3vib.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const connectDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = connectDB;
