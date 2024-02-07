const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const csrf = require('csurf');
const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const Products = require('../models/Products');
const Customer = require('../models/customer')


const addProductsController = require('../controllers/addProducts');
const getProductsController = require('../controllers/getProducts');
const deleteProductController = require('../controllers/deleteProducts');
const authMiddleware = require('./authMiddleware');




router.post('/addProducts', addProductsController);
router.get('/getProducts', getProductsController);
router.delete('/deleteProduct/:id', deleteProductController);

const csrfProtection = csrf();
router.use(csrfProtection);

router.get('/', (req, res) => {
    res.render('index')
});

router.get('/about', (req, res) => {
    res.render('about');
});

router.get('/contact', (req, res) => {
    res.render('contact');
});


router.get('/testimonial', (req, res) =>{
    res.render('testimonial');
});

router.get('/Products', (req, res) => {
    res.render('Products');
});

router.get('/shop', (req, res) => {
    Products.find().exec().then(docs => {
        const productChunks=[];
        const chunkSize = 3;
        for (let i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize))
        }
        res.render('shop', {title: 'Cocoalate', product: productChunks});
    }).catch(err => {
        console.error(err);
        res.status(500).send('Error by searching product.');
    });
});

router.get('/order/:id', function(req, res, next) {
    const productId = req.params.id;
    const order = new Order(req.session.order ? req.session.order : {});

    Products.findById(productId, function(err, product) {
        if(err|| !product) {
            return res.redirect('/shop');
        }
        order.add(product, product.id);
        req.session.order = order;
        console.log(req.session.order)
        res.redirect('/order')

    })
});

router.get('/order', function(req, res, next) {
    if(!req.session.order) {
        return res.render('order', {products: null, totalPrice: 0});
    }
    const order = new Order(req.session.order);
    res.render('order', {products: order.generateArray(), totalPrice: order.totalPrice});
})

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

function notLoggedIn(req, res, next) {
    if(!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/profile');
};

router.get('/register', notLoggedIn, function(req, res) {
    const messages = req.flash('error')
    res.render('login', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/register', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/register',
    failureFlash: true
}));

router.get('/profile', isLoggedIn, function(req, res, next) {
    res.render('profile', {customer: req.customer});
});

router.get('/login', notLoggedIn, function(req, res) {
    const messages = req.flash('error')
    res.render('login', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/logout', isLoggedIn, function(req, res, next) {
    req.logout();
    res.redirect('/login');
});

router.get('/addProducts', (req, res) => {
    res.render('addProducts');
});

router.get('/deleteProducts', (req, res) => {
    res.render('deleteProducts');
});

router.get('/order', (req, res) => {
    res.render('order');
});

router.get('/profile',  authMiddleware, (req, res) => {
    const customer = req.customer; // Supondo que os dados do cliente estejam disponíveis na solicitação
    res.render('profile', { customer });
});



router.get('*', (req, res) => {
    res.render('NotFound');
});

module.exports = router;
