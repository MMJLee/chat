import { useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import Chat from "./components/Chat";

export default function Room() {
  const {room_id} = useParams();
  const { socket } = useOutletContext();

  useEffect(() => {
    console.log(room_id)
    if (!socket) return;
    socket.emit("c_join", {room_id});
  }, [socket]);

  return <Chat/>;
}