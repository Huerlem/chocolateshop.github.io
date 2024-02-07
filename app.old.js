// My first HTTP server
const http =  require('http');
const fs = require('fs');


//create the arrow function
const server = http.createServer((req, res) => {
    //console.log("Request received")
    console.log('Received request method = ${req.method}, and URL = ${req.url}')
/*
    if(req.url === '/'){
        res.statusCode = 200;
        res.end('Welcome to Homepage')
    }
    
    else if (req.url === '/about'){
        res.statusCode = 200;
        res.end('This is my about page')
    }
    
    else if (req.url === '/contact'){
        res.statusCode = 200;
        res.end('This is my contact page')
    }
    
    else{
        res.statusCode = 404;
        res.end('This is my contact page')
    }

    //res.statusCode = 300;
    //res.write("Hello World")
    //res.end();
    //res.end("Welcome to this new Module")

    //sending the html files in response to any request
    */



    if(req.url === '/'){
        res.statusCode = 200;
        res.end(fs.readFileSync('index.html'))
    }

    else if (req.url === '/about'){
        res.statusCode = 200;
        res.end(fs.readFileSync('about.html'))
    }

    else if (req.url === '/contact'){
        res.statusCode = 200;
        res.end(fs.readFileSync('contact.html'))
    }

    else{
        res.statusCode = 404;
        res.end(fs.readFileSync('notfound.html'))
    }

})

const port = 4000;
const hostname = '127.0.0.1';

//the server should be listen
server.listen(port, hostname, () => {
    console.log('Server ${hostname} is running on port number ${port}');
    console.log('Server url = https://${hostname}:${port}');
});

