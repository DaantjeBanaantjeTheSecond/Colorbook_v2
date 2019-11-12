const express = require('express');
const socketio = require('socket.io');

//const hostname = '127.0.0.1';
const port = 3000;

const http = require('http');
const app = express();
const server = http.Server(app);
const io = socketio(server);

app.use(express.static(__dirname + '/app'));

let userColors = [];
let mousePositions = {};

io.on('connection', connected);

//setInterval(log, 1000);

function log() {
    console.log(mousePositions);
    console.log(userColors);
}

function connected(socket) {
    console.log("User: "+socket.id+" connected");

    socket.on('userColor', function(userColor) {
        let allreadyIn = false;
        userColors.forEach(function(color) {
            if (color == userColor) {
                allreadyIn = true;
                return;   
            }
        });
        if (!allreadyIn) userColors.push(userColor);
    });

    socket.on('mouse', function(data) {
        mousePositions[socket.id] = data;

        io.emit('mousePositions', mousePositions);
    });

    socket.on('friendRequest', function(data) {
      console.log(data);
      io.to(data.reciever).emit("personalFriendRequest", data.sender);
    });

    socket.on('disconnect', function () {
        console.log(socket.id+" left");
        delete mousePositions[socket.id];
        userColors = [];
        io.emit('updateOnlineUsers');
    });
};

server.listen(port);