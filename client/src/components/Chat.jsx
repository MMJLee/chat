import { useEffect, useState } from 'react'
import { useOutletContext, useParams } from "react-router-dom";

export default function Chat() {
  const { socket, user } = useOutletContext();
  // const { user } = useOutletContext();
  const [message, setMessage] = useState("")
  const [chat, setChat] = useState([])
  const [typing, setTyping] = useState('');
  const {room_id} = useParams();
  
  useEffect(() => {
    if (!socket) return;
    socket.on("s_msg", (data) => {
      setChat((chat) => [...chat,{
        user: data.user, 
        message: data.message}])    
    });
    socket.on("s_start", (data) => {
      setTyping(data.user);
    });
    socket.on("s_stop", () => {
      setTyping('');
    });
    socket.on("s_join", (data)=> {
      setChat((chat) => [...chat,{
        user: data.user,
        message: 'joined'}])
    });
  }, [socket]);
  
  useEffect(() => {
    if (!socket) return;
    const timeOutId = setTimeout(() => socket.emit("c_stop", {room_id: room_id, user: user}), 500);
    return () => clearTimeout(timeOutId);
  }, [message]);

  const el = document.getElementById('chat-messages');
  if (el) {
    el.scrollTop = el.scrollHeight;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (message != '') {
      setChat((chat) => [...chat,message]);
      socket.emit("c_msg", {room_id:room_id, user:user, message:message});
      setMessage(""); 
    }
  }

  function handleKeyDown(e) {
    socket.emit('c_start', {room_id: room_id, user: user});
    if (message != '' && e.keyCode == 13) {
      socket.emit("c_stop", {room_id: room_id, user: user})
      setChat((chat) => [...chat,{user:user, message:message}]);
      socket.emit("c_msg", {room_id:room_id, user:user, message:message});
      setMessage("");
    }
  }

  function handleKeyUp(e) {
    if (e.keyCode == 13) {
      setMessage("");
    }
  }

  function Typing() {
    if (typing != '') {
      return <p className='typing-alert'> {typing} is typing...</p>
    }
  }

  function ChatMessageItem(props) {
    return (
      <div className={user == props.user ? 'chat-message-container my-messages' : 'chat-message-container'}>
        <p className='chat-message'>{props.user}<br></br>{props.message}</p>
      </div>
    )
  }
  
  return (
    <div className='chat-container'>
      <ul id="chat-messages" className="hide-scrollbar">
        {chat.map((data, index) => <ChatMessageItem key={index} user={data.user} message={data.message}/>)}
      </ul>
      <Typing/>
      <form className="chat-form" onSubmit={handleSubmit} onKeyDown={e => handleKeyDown(e)} onKeyUp={e => handleKeyUp(e)}>
        <div className='chat-text-container'>
          <textarea className="chat-text" value={message} autoComplete="off" placeholder='type a message' onChange={(e) => setMessage(e.target.value)}/>
        </div>
        <button className="chat-button" type="submit">Send</button>
      </form>
    </div>
  )
}