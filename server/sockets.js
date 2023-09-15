
const sockets = (socket) => {
  socket.inactivityTimeout = setTimeout(() => socket.disconnect(true), 1000 * 60 * 2);

  socket.on("c_join", (data) => {
    socket.username = data.user
    socket.join(data.room_id)
    socket.broadcast.to(data.room_id).emit('s_join', {user: socket.username+' joined'});
  })
  
  socket.on('c_msg', (data) => {
    clearTimeout(socket.inactivityTimeout);
    socket.inactivityTimeout = setTimeout(() => socket.disconnect(true), 1000 * 60 * 10);
    socket.broadcast.to(data.room_id).emit("s_msg", {user: socket.username, message: data.message}); 
  });

  socket.on('c_start', (data) => {
    socket.broadcast.to(data.room_id).emit("s_start", {user: socket.username});
  });

  socket.on('c_stop', (data) => {
    socket.broadcast.to(data.room_id).emit("s_stop", {user: socket.username});
  });

  socket.on("disconnecting", (data) => {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        socket.to(room).emit("s_leave", {user: socket.username+' left'});
      }
    }
  });
};

export default sockets;