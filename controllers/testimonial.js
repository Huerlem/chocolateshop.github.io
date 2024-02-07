const mongoose = require('mongoose');

const testimonialController = (res, req) =>{
    //res.send('This is my testimonial message')
    //res.sendFile(path.resolve(__dirname, 'pages/testimonial.html'))
    res.render('testimonial')
}

module.exports = testimonialController;