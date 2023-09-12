
const sockets = (socket) => {
  socket.on("c_join", (data) => {
    socket.join(data.room_id)
    let s = socket.broadcast;
    s = data.room_id ? s.to(data.room_id) : s;
    s.emit('s_join', {user: data.user});
  })
  
  socket.on('c_msg', (data) => {
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
};

export default sockets;