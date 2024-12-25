require("dotenv").config();

const express = require("express");
const app = express();
const connectDB = require("./config/db");
const cors = require("cors");

app.use(cors());
app.use(express.json());


const port = process.env.PORT || 3000;
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
