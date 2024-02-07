const Customer = require('../models/customer');
const path = require('path'); 
module.exports = (req, res) =>{
    console.log(`Received request method = ${req.method}, and URL = ${req.url}` )
    // res.send('Welcome to QHO541')
    //res.sendFile(path.resolve(__dirname, 'pages/index.html'))
    res.render('index')
}

module.exports = indexController;