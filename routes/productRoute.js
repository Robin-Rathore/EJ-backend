const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const dotenv = require("dotenv");
const {
  createProduct,
  getAllProducts,
  getProduct,
  deleteProduct,
  updateProduct,
  getPhoto,
  getFilteredProducts,
  getPricedProducts,
} = require("../controller/productController");
const formidable = require("express-formidable");
const { Product } = require("../model/productModel");
const { SingleProduct } = require("../model/frontProduct");
const router = express.Router();


dotenv.config()
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key:process.env.API_KEY ,
    api_secret: process.env.CLOUDINARY_API_SECRET, 
}); 


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
      folder: 'uploads',
      format: async (req, file) => 'png', // or any other supported format
      public_id: (req, file) => Date.now() + '-' + file.originalname,
  },
});

const upload = multer({ storage: storage });

router
  .post("/create", upload.array("images", 3), async (req, res) => {
    try {
      const {
        name,
        description,
        color,
        type,
        bluetoothVersion,
        category,
        discount,
        price,
        stock,
        model,
        screenSize,
        charging,
        battery,
        displayType,
      } = req.body;
      const imagePaths = req.files.map((file) => file.path);
      const newProduct = new Product({
        ...req.body,
        images: imagePaths,
      });
      console.log(name);

      await newProduct.save();
      res.status(201).send({
        success: true,
        message: "Products Created Successfully",
        newProduct,
      });
    } catch (error) {
      res.status(500).json({ message: "Error adding product", error });
    }
  })
  .put("/update/:id", upload.array("images", 3), async (req, res) => {
    try {
      const id = req.params;
      console.log(id.id);
      const {
        name,
        description,
        color,
        type,
        bluetoothVersion,
        category,
        discount,
        price,
        stock,
        model,
        screenSize,
        charging,
        battery,
        displayType,
      } = req.body;
      const imagePaths = req.files.map((file) => file.path);
      const newProduct = await Product.findByIdAndUpdate(
        id.id,
        {
          ...req.body,
          images: imagePaths,
        },
        { new: true }
      );
      console.log(name);

      await newProduct.save();
      res.status(201).send({
        success: true,
        message: "Products Created Successfully",
        newProduct,
      });
    } catch (error) {
      res.status(500).json({ message: "Error adding product", error });
    }
  })
  .get("/getProducts", async (req, res) => {
    try {
      const products = await Product.find({}).sort({ createdAt: -1 });
      res.status(200).send({
        success: true,
        message: "Products fetched Successfully",
        products,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Error fetching products", error });
    }
  })

  .get("/getProduct/:id", getProduct)
  .delete("/delete/:id", deleteProduct)
  .get("/photo/:id", getPhoto)
  .post("/filteredProducts", async (req, res) => {
    try {
      const { category } = req.body;
      const products = await Product.find({ category: category });
      res.status(200).send({
        success: true,
        products,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res
        .status(500)
        .send({ success: true, message: "Error fetching products", error });
    }
  })
  .post("/pricedProducts", getPricedProducts)
  .get("/getLatest", async (req, res) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 }).limit(4);
      res.status(200).send({ success: true, products });
    } catch (error) {
      res.status(500).send({
        success: false,
        error,
      });
    }
  })
  .get("/product-count", async (req, res) => {
    try {
      const total = await Product.find({}).estimatedDocumentCount();
      res.status(200).send({ success: true, total });
    } catch (error) {
      res.status(500).send({
        success: false,
        error,
      });
    }
  })
  .get("/productList/:page", async (req, res) => {
    try {
      const perpage = 6;
      const page = req.params.page ? req.params.page : 1;
      const products = await Product.find({})
        .skip((page - 1) * perpage)
        .limit(perpage)
        .sort({ createdAt: -1 });
      res.status(200).send({ success: true, products });
    } catch (error) {
      res.status(500).send({
        success: false,
        error,
      });
    }
  });
exports.router = router;
