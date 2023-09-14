
const sockets = (socket) => {
  socket.inactivityTimeout = setTimeout(() => socket.disconnect(true), 1000 * 60);

  socket.on("c_join", (data) => {
    socket.join(data.room_id)
    let s = socket.broadcast;
    s = data.room_id ? s.to(data.room_id) : s;
    s.emit('s_join', {user: data.user});
  })
  
  socket.on('c_msg', (data) => {
    clearTimeout(socket.inactivityTimeout);
    socket.inactivityTimeout = setTimeout(() => socket.disconnect(true), 1000 * 60);
    let s = socket.broadcast;
    s = data.room_id ? s.to(data.room_id) : s;
    s.emit("s_msg", {user: data.user, message: data.message});
  });

  socket.on('c_start', (data) => {
    let s = socket.broadcast;
    s = data.room_id ? s.to(data.room_id) : s;
    s.emit("s_start", {user: data.user});
  });

  socket.on('c_stop', (data) => {
    let s = socket.broadcast;
    s = data.room_id ? s.to(data.room_id) : s;
    s.emit("s_stop", {user: data.user});
  });

  socket.on('c_leave', (data) => {
    let s = socket.broadcast;
    let rooms = Object.keys(socket.rooms);
    rooms.forEach((room) => {
      if (socket_id !== room) {
        socket.leave(room);
        s.to(room).emit("s_leave", {user: data.user});
      }
    });
  });
};

export default sockets;