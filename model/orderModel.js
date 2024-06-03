const mongoose = require("mongoose")

const orderSchema = mongoose.Schema({
    id:{
        type:mongoose.ObjectId,
        ref:"User",
    },
    products:{
        type:[],
        default:[],
    },
    date:{
        type:Date,
        default:Date.now()
    },
    phone:{
        type:Number,
        required:true,
    },
    address:{
        type:Object,
        required:true,
    }
})

exports.Order = new mongoose.model("Order",orderSchema)