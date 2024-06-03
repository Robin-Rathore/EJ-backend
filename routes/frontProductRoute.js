const express = require("express")
const multer = require("multer");
const { FrontProduct, SingleProduct } = require("../model/frontProduct");
const router = express.Router()
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const dotenv = require("dotenv");

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



router.put('/addAdvProduct', upload.array('images', 4), async (req, res) => {
    try {
        const { name,
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
            displayType, } = req.body;
            const id = "6654af193dfb078d9112963f"
        const imagePaths = req.files.map(file => file.path);
        console.log(id)
        const newProduct = await FrontProduct.findByIdAndUpdate(id,{
            ...req.body,
            images: imagePaths
        },{new:true});
        console.log(name)

        await newProduct.save();
        res.status(201).send({
            success: true,
            message: "Products Created Successfully",
            newProduct,
          });
    } catch (error) {
        res.status(500).json({ message: 'Error adding product', error });
    }
});

router.get('/getProduct', async (req, res) => {
    try {
        const products = await FrontProduct.find({});
        res.status(200).send(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products', error });
    }
});


exports.router=router