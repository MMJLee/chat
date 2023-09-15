import { useEffect, useState } from 'react'

export default function Chat({socket, user, room_id}) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [typing, setTyping] = useState('');
  const [count, setCount] = useState(0);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (!socket) return;
    socket.on("s_msg", (data) => {
      setChat((chat) => [...chat,{
        user: data.user, 
        message: data.message}]);
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
        message: ''}]);
    });
    socket.on("s_leave", (data)=> {
      setChat((chat) => [...chat,{
        user: data.user,
        message: ''}]);
    });
    socket.on("s_count", (data)=> {
      setCount(data.count);
    });
  }, [socket]);
  
  useEffect(() => {
    if (!socket) return;
    const timeOutId = setTimeout(() => socket.emit("c_stop", {room_id: room_id}), 500);
    return () => clearTimeout(timeOutId);
  }, [message]);

  useEffect(() => {
    const typingTimer = setInterval(() => setTyping(''), 1000);
    const countTimer = setInterval(() => socket.emit("c_count", {room_id: room_id}, 3000));
    return () => {
      clearInterval(typingTimer);
      clearInterval(countTimer);
    }
  },[]);

  const el = document.getElementById('chat-messages');
  if (el) el.scrollTop = el.scrollHeight;

  function handleKeyDown(e) {
    socket.emit('c_start', {room_id: room_id});
    if (e.keyCode == 13 && message.replace(/\s/g, '').length) {
      socket.emit("c_stop", {room_id: room_id})
      setChat((chat) => [...chat,{user:user, message:message}]);
      socket.emit("c_msg", {room_id:room_id, message:message});
      setMessage("");
      if (file) {
        socket.emit("c_file", {buffer:file});
        setFile(null)
      }
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
    if (props.user) {
      return (
        <div className={user == props.user ? 'chat-message-container my-messages' : 'chat-message-container'}>
          <div>
            <p className='chat-user'>{props.user}</p><p className='chat-message'>{props.message}</p>
          </div>
        </div>
      )
    }
  }

  function countText() {
    if (count < 2) {
      return "you're alone"
    }
    return `${count} chatters`
  }

  return (
    <div className='chat-container'>
      <ul id="chat-messages" className="hide-scrollbar">
        {chat.map((data, index) => <ChatMessageItem key={index} user={data.user} message={data.message}/>)}
      </ul>
      <Typing/>
      <form className="chat-form" onKeyDown={e => handleKeyDown(e)} onKeyUp={e => handleKeyUp(e)}>
        <div className='chat-text-container'>
          <textarea className="chat-text" value={message} autoComplete="off" placeholder={"send a message"} onChange={e => setMessage(e.target.value)}/>
          <div className='chat-room-counter'>{countText()}</div>
        </div>
      </form>
    </div>
  )
}