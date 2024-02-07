const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const mongoose = require('mongoose');

const path = require('path');
const cron = require('node-cron');

const ejs = require('ejs');
const bodyParser = require('body-parser'); 
const passport = require ('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const { body, validationResult } = require('express-validator');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const jwtSecret = process.env.JWT_SECRET;
dotenv.config();

const IndexRoute = require('./route/index');

const Customer = require('./models/customer');
const Products = require('./models/Products');

// Definir modelo de dados para o Pedido
const Order = require('./models/order');
const authMiddleware = require('./route/authMiddleware');
const aboutController = require('./controllers/about');
const contactController = require('./controllers/contact');
const testimonialController = require('./controllers/testimonial')
const notfoundController = require('./controllers/notfound');

const app = express()


//configuration of visualisation
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret:'mysupersecret', 
    resave: false, 
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongoUrl: 'mongodb://127.0.0.1/Chocolate_shop',
        ttl: 180*60
    }),
    
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
});

//routers
app.use('/', IndexRoute);

//connect with the MongoDB database
mongoose.connect('mongodb://localhost:27017/Chocolate_shop')
    .then(() => {
        console.log('MongoDB Connected');
        const port = process.env.PORT ||4000;
        const hostname = '127.0.0.1';
        app.listen(port, hostname, () => {
            console.log(`Server running at http://${hostname}:${port}/`);
        });
    })
    .catch((err) => {
        console.error('MongoDB Connection Error:', err);
    });
require('./config/passport');


//controllers
const addProductsController = require('./controllers/addProducts')
app.post('/addProducts', addProductsController)

const getProductsController = require('./controllers/getProducts')
app.get('/Products', getProductsController)

const deleteProductsController = require('./controllers/deleteProducts')
app.get('/deleteProducts', deleteProductsController)

app.get('/about', aboutController);
app.get('/contact', contactController);
app.get('/testimonial', testimonialController);
app.get('/notfound', notfoundController);

// Tarefa agendada para atualizar o estoque automaticamente
cron.schedule('0 0 * * *', async () => {
    try {
        // Encontrar todos os pedidos feitos nas últimas 24 horas
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);

        const recentOrders = await Order.find({ createdAt: { $gte: twentyFourHoursAgo } });

        // Atualizar a quantidade disponível do produto com base nos pedidos
        for (const order of recentOrders) {
            const existingProduct = await Products.findOne({ name: order.product });

            if (existingProduct) {
                existingProduct.quantity_stock -= order.quantity;
                await existingProduct.save();
            }
        }

        console.log('Stock updated successfully.');
    } catch (error) {
        console.error('Error updating stock:', error);
    }
});


module.exports = app;
