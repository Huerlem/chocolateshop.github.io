const Product = require('../models/Products');

const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1/Chocolate_shop')
const products = [
    new Product({
        imagePath:'pictures/chocolate_bar.jpeg',
        product:'Milk Chocolate',
        description:'Chocolate bar creammy. Homemade.',
        weight: 110,
        price: 5,
        quantity_stock: 100
    }),
    new Product({
        imagePath:'pictures/truffle.jpg',
        product:'Dark Truffles',
        description:'Dark truffles creammy. Homemade.',
        weight: 30,
        price: 2,
        quantity_stock: 100
    }),
    new Product({
        imagePath:'pictures/box_truffles.jpg',
        product:'Box Truffles',
        description:'Box of Dark truffles creammy. Homemade.',
        weight: 400,
        price: 15,
        quantity_stock: 100
    }),
    new Product({
        imagePath:'pictures/mint_chocolate.jpg',
        product:'Mint Chocolate',
        description:'Mint Chocolate bar creammy. Homemade.',
        weight: 110,
        price: 5,
        quantity_stock: 100
    }),
    new Product({
        imagePath:'pictures/pistachio_almond.jpg',
        product:'Puistachio and Almond truffles',
        description:'Creammy truflles. Homemade.',
        weight: 70,
        price: 4,
        quantity_stock: 100
    }),
    new Product({
        imagePath:'pictures/white_chocolate.jpg',
        product:'White Chocolate',
        description:'Whit Chocolate bar creammy. Homemade.',
        weight: 110,
        price: 5,
        quantity_stock: 100
    })
];

const done = 0;
for (var i= 0; i< products.length; i++) {
    products[i].save(function(err, result) {
        done++;
        if(done === products.lenght){
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}

