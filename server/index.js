import express from "express";
import http from "http";
import { Server } from "socket.io";
import sockets from "./sockets.js";
import cors from 'cors';

const port = 3000;
const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL || "http://127.0.0.1:5173",
}));
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  path: "/chat/socketio/",
  cors: {
    origin: process.env.CLIENT_URL || "http://127.0.0.1:5173",
    credentials: true,
    methods: ["GET", "POST"],
  }
})

io.on("connection", sockets);

httpServer.listen(port, () => {});