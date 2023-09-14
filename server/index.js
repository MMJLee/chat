import express from "express";
import http from "http";
import { Server } from "socket.io";
import sockets from "./sockets.js";
import cors from 'cors';

const port = 3000;
const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL||"http://127.0.0.1:5173", 
}));
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  path: "/chat/socket.io",
  cors: {
    origin: process.env.CLIENT_URL||"http://127.0.0.1:5173", 
    credentials: true,
    methods: ["GET", "POST"],
  }
})

io.on("connection", sockets);

httpServer.listen(port, () => {});

app.get('chat/count', (req, res) => {
  res.send( {count:io.engine.clientsCount} );
});

app.get('chat/count/:room_id', (req, res) => {
  if(io.sockets.adapter.rooms.has(req.params.room_id)) {
    res.send({count: io.sockets.adapter.rooms.get(req.params.room_id).size});
  } else {
    res.send({count: 0});
  }
});
