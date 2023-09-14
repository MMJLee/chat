import { useEffect, useState } from 'react'

export default function Chat({socket, user, room_id}) {
  const [message, setMessage] = useState("")
  const [chat, setChat] = useState([])
  const [typing, setTyping] = useState('');
  
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
        message: ''}])
    });
    socket.on("s_leave", (data)=> {
      setChat((chat) => [...chat,{
        user: data.user,
        message: ''}])
    });
  }, [socket]);
  
  useEffect(() => {
    if (!socket) return;
    const timeOutId = setTimeout(() => socket.emit("c_stop", {room_id: room_id}), 500);
    return () => clearTimeout(timeOutId);
  }, [message]);

  const el = document.getElementById('chat-messages');
  if (el) {
    el.scrollTop = el.scrollHeight;
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage();
  }

  function handleKeyDown(e) {
    socket.emit('c_start', {room_id: room_id});
    if (e.keyCode == 13) sendMessage();
  }

  function sendMessage() {
    if (message.replace(/\s/g, '').length) {
      socket.emit("c_stop", {room_id: room_id})
      setChat((chat) => [...chat,{user:user, message:message}]);
      socket.emit("c_msg", {room_id:room_id, message:message});
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