const express = require("express");
const { sequelize } = require("./models");
const router = require("./routes/auth.route");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/api", router);

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("connection to the database established successfully");
  } catch (error) {
    console.log("unable to connect with database", error);
  }
}

const PORT = process.env.PORT || 4001;
app.listen(PORT, async () => {
  connectDB();
  console.log(`server is running on : ${PORT}`);
});
