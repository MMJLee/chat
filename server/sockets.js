
const sockets = (socket) => {
  socket.on("c_join", ({room_id}) => {
    console.log(room_id)
    socket.join(room_id)
    let s = socket.broadcast;
    s = room_id ? s.to(room_id) : s;
    s.emit('s_join', 'joined');
  })
  
  socket.on('c_msg', ({room_id, message}) => {
    console.log(room_id,message)
    let s = socket.broadcast;
    s = room_id ? s.to(room_id) : s;
    s.emit("s_msg", {message});
  });

  socket.on('c_start', ({room_id}) => {
    let s = socket.broadcast;
    s = room_id ? s.to(room_id) : s;
    s.emit("s_start");
  });

  socket.on('c_stop', ({room_id}) => {
    let s = socket.broadcast;
    s = room_id ? s.to(room_id) : s;
    s.emit("s_stop");
  });
};

export default sockets;