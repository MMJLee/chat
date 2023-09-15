import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import Chat from "./components/Chat";

export default function Room() {
  const {room_id} = useParams();
  const { socket } = useOutletContext();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!socket || !user) return;
    socket.emit("c_join", {room_id:room_id, user:user});
  }, [socket,user]);

  function handleSubmit(e) {
    e.preventDefault();
    setUser(e.target[0].value);
  }
  
  function Chatroom({socket, user, room_id}) {
    if (user) {
      return <Chat socket={socket} user={user} room_id={room_id}/>
    } else {
      return (
        <form className="username-form" onSubmit={handleSubmit}>
          <input className="username-input" placeholder='select a username'></input>
        </form>
      );
    }
  }
  return (<Chatroom socket={socket} user={user} room_id={room_id}/>);
}