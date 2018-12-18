var socket_io = require("socket.io");
var io = socket_io();
var config = require('./config');
var clientDB = require('./models/clientDB');
var config = require('./config');

io.on('connection', function (socket) {
    // console.log("REQUEST_RECEIVER client connected");
    socket.on('JoinRoom', client => {
        // console.log(socket);
        socket.userId = client.user;
        socket.join(client.room);
        console.log("SERVER: " + client.room + " đã kết nối " + socket.id);
        io.to(client.room).emit('joinRoom', client.room + " đã kết nối " + socket.id);
        if (client.room == config.roomDriver) {
            clientDB.addClient({ userId: client.user, socketId: socket.id });
        }
        
    });
    
});

module.exports = io;  