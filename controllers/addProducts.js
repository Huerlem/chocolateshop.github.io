const Products = require('../models/Products');


const addProductsController = async (req, res) => {
    try {
        const { product, description, weight, price, category, quantity_stock } = req.body;
        //create new product
        const newProduct = new product({
            product: String,
            description: String,
            weight: Number,
            price: Number,
            category: String,
            quantity_stock: NUmber
        });
        //saving the new product
        await newProduct.save();
        //send a message
        res.status(201).send('Product added successfully');
    } catch (error) {
        // some issues, it will send a message too
        console.error('Error adding product:', error);
        res.status(500).send('Internal server error');
    }
}

module.exports = addProductsController;