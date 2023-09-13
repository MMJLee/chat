import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import Chat from "./components/Chat";

export default function Room() {
  const {room_id} = useParams();
  const { socket, user } = useOutletContext();

  useEffect(() => {
    if (!socket) return;
    socket.emit("c_leave", {user:user});
    socket.emit("c_join", {room_id:room_id, user:user});
  }, [socket,room_id]);

  return (<Chat/>);
}