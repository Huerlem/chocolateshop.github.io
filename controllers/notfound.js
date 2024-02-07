const mongoose = require('mongoose');

const notfoundController = (req, res) => {
    res.status(404).send('Página não encontrada');
};

module.exports = notfoundController;