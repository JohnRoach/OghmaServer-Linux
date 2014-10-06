
var path = require('path');
var fs = require('fs');

var io = require("socket.io").listen(8001);

var node_ip="";


var app = require('http').createServer(function (request, response) {
    console.log('request starting...');

    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = './index.html';

    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }

    fs.exists(filePath, function(exists) {

        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                }
                else {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                }
            });
        }
        else {
            response.writeHead(404);
            response.end();
        }
    });

});


app.listen(8100);

var io2 = require('socket.io').listen(app);
io2.sockets.on('connection', function (socket) {

    socket.on('search', function (init_bool) {
        //need to get list of sensors after stop (i.e. before a experiment starts)
        socket.emit('node_ip',node_ip);
    });
});

console.log("server started");

io.sockets.on("connection",function(socket){
    // Display a connected message
    console.log("Server-Client Connected!");

    // When we receive a message...
    socket.on("ip",function(data){
        node_ip=data;
        socket.broadcast.emit('node_ip_info_received', node_ip);
    });


});