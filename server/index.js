import express from "express";
import http from "http";
import { Server } from "socket.io";
import sockets from "./sockets.js";

const port = 3000;
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin:[process.env.CLIENT_URL],
    methods: ["GET", "POST"],
    credentials: true
  }
})

io.on("connection", sockets);

httpServer.listen(port, () => {});

app.get('/count/:room_id', (req, res) => {
  res.send({ count:io.of('/room/'+req.params['room_id']).sockets.size });
})
