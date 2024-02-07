const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');

// Rota para exibir o perfil do cliente
router.get('/profile', async (req, res) => {
    try {
        // Obter informações do cliente atualmente logado
        const customer = await Customer.findById(req.user.id);
        res.render('profile', { customer });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao carregar o perfil do cliente');
    }
});

module.exports = router;