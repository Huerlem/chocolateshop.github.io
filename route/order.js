const express = require('express');
const router = express.Router();
const Products = require('./models/Products');
const Order = require('../models/order');

router.post('/addToOrder', async (req, res) => {
    try {
        // Extrair detalhes do pedido do corpo da solicitação
        const { customer, product, quantity } = req.body;

        // Verificar se o produto solicitado está disponível em estoque
        const existingProduct = await Products.findOne({product});
        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (existingProduct.quantity_stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        // Calcular o preço total do pedido
        const total = existingProduct.price * quantity;

        // Criar um novo pedido e salvar no banco de dados
        const newOrder = new Order({
            customer,
            product: existingProduct,
            quantity,
            price: existingProduct.price,
            total
        });
        await newOrder.save();

        // Atualizar o estoque do produto no banco de dados
        existingProduct.quantity_stock -= quantity;
        await existingProduct.save();

        res.status(201).json({ message: 'Order placed successfully!' });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Failed to place order' });
    }
});

router.get('/order/:customer', async (req, res) => {
    try {
        const customer = req.params.customer;

        // Busque todos os pedidos associados ao ID do cliente no banco de dados
        const customerOrder = await Order.find({customer });

        // Responda com os pedidos recuperados
        res.status(200).json(customerOrder);
    } catch (error) {
        console.error('Error fetching customer orders:', error);
        res.status(500).json({ message: 'Failed to fetch customer orders' });
    }
});

module.exports = router;