const aboutController = (res, req) => {
    //res.send('This is my about message')
    //res.sendFile(path.resolve(__dirname, 'pages/about.html'))
    res.render('about')
};

module.exports = aboutController;
