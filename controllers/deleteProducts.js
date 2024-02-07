const Products = require('../models/Products');

const deleteProductsController = async (req, res) => {
    try {
        const product = req.params.product;
        await Products.deleteOne({product});
        res.send('Product deleted successfully');
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('Internal server error');
    }
}

module.exports = deleteProductsController;