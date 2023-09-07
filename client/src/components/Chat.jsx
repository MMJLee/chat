import { useEffect, useState } from 'react'
import { useOutletContext, useParams } from "react-router-dom";

export default function Chat() {
  const { socket } = useOutletContext();
  const [message, setMessage] = useState("")
  const [chat, setChat] = useState([])
  const [typing, setTyping] = useState(false);
  const {room_id} = useParams();
  useEffect(() => {
    if (!socket) return;
    socket.on("s_msg", (data) => {
      setChat((chat) => [...chat,data.message])
    });
    socket.on("s_start", () => {
      setTyping(true);
    });
    socket.on("s_stop", () => {
      setTyping(false);
    });
    socket.on("s_join", (data)=> {
      setChat((chat) => [...chat,data])
    });
  }, [socket]);
  
  useEffect(() => {
    if (!socket) return;
    const timeOutId = setTimeout(() => socket.emit("c_stop", {room_id}), 500);
    return () => clearTimeout(timeOutId);
  }, [message]);

  function handleSubmit(e) {
    e.preventDefault();
    if (message != '') {
      socket.emit("c_msg", {room_id , message});
      setMessage("");
    }
  }

  function handleKeyDown(e) {
    socket.emit('c_start', {room_id});
    if (message != '' && e.keyCode == 13) {
      socket.emit("c_msg", {room_id , message});
      setMessage("");
    }
  }

  function handleKeyUp(e) {
    if (e.keyCode == 13) {
      setMessage("");
    }
  }

  function Typing() {
    if (typing) {
      return <p>typing...</p>
    }
  }

  return (
    <div id="app" className="dark">
      <div id="container">
        <ul id="messages">
          {chat.map((data, index) => <li sx={{textAlign:"right"}} key={index}>{data}</li>)}
        </ul>
        <Typing/>
        <form id="form" onSubmit={handleSubmit} onKeyDown={e => handleKeyDown(e)} onKeyUp={e => handleKeyUp(e)}>
          <textarea id="input" name="message" value={message} autoComplete="off" placeholder='send a message' onChange={(e) => setMessage(e.target.value)}/>
          <button id="submit" type="submit">Send</button>
        </form>
      </div>
    </div>
  )
}