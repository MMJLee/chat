const express = require('express')
const http = require('http')
const {Server} = require('socket.io')
const port = process.env.PORT || 3000;

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin:["http://127.0.0.1:5173","https://mjlee.dev/chat/*"],
  }
})

io.on('connection', (socket) => {
  socket.on('message', msg => {
    console.log(msg)
    io.emit('message', msg);
  });
});

httpServer.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});