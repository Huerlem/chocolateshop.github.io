const contactController = (res, req) =>{
    //res.send('This is my contact message')
    //res.sendFile(path.resolve(__dirname, 'pages/contact.html'))
    res.render('contact')
}

module.exports = contactController;