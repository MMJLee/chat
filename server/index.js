import express from "express";
import {Router} from "express";
import http from "http";
import { Server } from "socket.io";
import sockets from "./sockets.js";

const port = process.env.PORT || 3000;
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin:["http://127.0.0.1:5173","http:localhost:5173*"],
  }
})

io.on("connection", sockets);

httpServer.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

app.get('/room/count/:room_id', (req, res) => {
  res.send(io.of('/room/'+req.params['room_id']).sockets.size);
})
