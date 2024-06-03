const mongoose = require("mongoose");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const userRouter = require("./routes/userRouter");
const categoryRouter = require("./routes/categoryRoute");
const productRouter = require("./routes/productRoute");
const orderRouter = require("./routes/orderRoute");
const frontProductRouter = require("./routes/frontProductRoute");
const bodyParser = require("body-parser");

const path = require("path");
dotenv.config();
app.use(express.static("public"));
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected Successfully");
  } catch (error) {
    console.log(error);
  }
};

connectDB();
app.use("/api/v1/user", userRouter.router);
app.use("/api/v1/category", categoryRouter.router);
app.use("/api/v1/product", productRouter.router);
app.use("/api/v1/order", orderRouter.router);
app.use("/api/v1/frontProduct", frontProductRouter.router);

//payments

// This is your test secret API key.

app.listen(process.env.PORT, () => {
  console.log(`Server started at port ${process.env.PORT}`);
});
