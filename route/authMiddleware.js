const jwt = require('jsonwebtoken');
const Customer = require('../models/customer'); // Supondo que você tenha um modelo de Customer para o seu banco de dados

// Função do middleware de autenticação
function authMiddleware(req, res, next) {
    // Obtenha o token de autorização do cabeçalho da solicitação
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Se o token não estiver presente, retorne um erro de autenticação
    if (!token) {
        return res.status(401).json({ error: 'Token de autenticação não fornecido' });
    }

    // Verifique se o token é válido e decodifique-o
    jwt.verify(token, 'seu_secreto_jwt', async (err, decodedToken) => {
        if (err) {
            return res.status(403).json({ error: 'Token de autenticação inválido' });
        }

        try {
            // Encontre o cliente associado ao ID do cliente no token
            const customer = await Customer.findById(decodedToken.customerId);
            
            // Se o cliente não for encontrado, retorne um erro de autenticação
            if (!customer) {
                return res.status(404).json({ error: 'Cliente não encontrado' });
            }

            // Anexe os dados do cliente à solicitação para uso posterior nas rotas protegidas
            req.customer = customer;

            // Continue com o próximo middleware ou manipulador de rota
            next();
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    });
}

module.exports = authMiddleware;
    
    
