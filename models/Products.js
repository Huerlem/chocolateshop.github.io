const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    imagePath:{
        type: String,
        required: true
    },
    product:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    weight:{
        type: Number,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    quantity_stock:{
        type:Number,
        required: true
    }
});

module.exports = mongoose.model('Products', ProductSchema);