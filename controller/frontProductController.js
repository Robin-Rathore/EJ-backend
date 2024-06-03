const fs = require("fs");
const { FrontProduct } = require("../model/frontProduct");
const multer = require("multer")
exports.createProduct = async (req, res) => {
  try {
    const { name, actualPrice, discount } = req.fields;
    
    await product.save();
    res.status(201).send({
      success: true,
      message: "Products Created Successfully",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Creating Product",
      error,
    });
  }
};



exports.getFrontProduct = async (req, res) => {
    try {
      const products = await FrontProduct.find({});
      res.status(200).send({
        success: true,
        message: "Products fetched successfully",
        products,
      });
    } catch (error) {
      res.status(400).send({
        success: false,
        message: "Error in getting products",
        error,
      });
    }
  };
  