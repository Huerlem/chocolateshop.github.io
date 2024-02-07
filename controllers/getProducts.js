const Products = require('../models/Products');

const getProductsController = async (req, res) => {
    try {
        const product = await Products.find();
        res.json(product);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Internal server error');
    }
}

module.exports = getProductsController;