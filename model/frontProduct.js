const mongoose = require("mongoose")

const frontProductSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:String,
        required:true, 
    },
    stock:{
        type:Number,
        required:true,
    },
    discount:{
        type:Number,
        required:true,
    },
    stock:{
        type:Number,
        required:true,
    },
    color:{
        type:String,
        required:true,
    },
    model:{
        type:String,
        // required:true,
        default:"NA"
    },
    screenSize:{
        type:String,
        default:"NA"
        // required:true,
    },
    type:{
        type:String,
        default:"NA"
        // required:true,
    },
    displayType:{
        type:String,
        default:"NA"
        // required:true,
    },
    charging:{
        type:String,
        default:"NA"
        // required:true,
    },
    battery:{
        type:String,
        default:"NA"
        // required:true,
    },
    bluetoothVersion:{
        type:String,
        default:"NA"
        // required:true,
    },
    voiceAssistance:{
        type:String,
        default:"NA"
        // required:true,
    },
    images:{
        type:[String],
        required:true
    }
},{timestamps:true})

exports.FrontProduct = mongoose.model("FrontProduct",frontProductSchema);