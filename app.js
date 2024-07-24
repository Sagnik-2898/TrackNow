

const express = require('express');
const app = express();
const port = 3000;
const socketio = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = socketio(server);


app.set('view engine', 'ejs');
app.use(express.static('public'));

// Handle socket connections
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('send-location', (data) => {
        console.log('Location received from client:', socket.id, data);
        io.emit('recieve-location', { id: socket.id, ...data });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        io.emit('client-disconnected', socket.id);
    });
});



app.get('/', (req, res) => {
    res.render('index');
});

// Start the server and listen on the specified port
server.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
