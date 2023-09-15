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
    socket.on("s_file", (data)=> {
      setChat((chat) => [...chat,{
        user: data.user,
        filename: data.filename,
        buffer: data.buffer}]);
    });
    socket.on("disconnect", (data)=> {
      if (data === "io server disconnect") {
        alert("You have been disconnected due to inactivity. Please refresh the page to reconnect.")
      }
    });
  }, [socket]);
  
  useEffect(() => {
    if (!socket) return;
    const timeOutId = setTimeout(() => socket.emit("c_stop", {room_id: room_id}), 500);
    return () => clearTimeout(timeOutId);
  }, [message]);

  useEffect(() => {
    socket.emit("c_count", {room_id: room_id})
    const typingTimer = setInterval(() => setTyping(''), 1000);
    const countTimer = setInterval(() => socket.emit("c_count", {room_id: room_id}), 3000);

    return () => {
      clearInterval(typingTimer);
      clearInterval(countTimer);
    }
  },[]);

  const el = document.getElementById('chat-messages');
  if (el) el.scrollTop = el.scrollHeight;

  function handleKeyDown(e) {
    socket.emit('c_start', {room_id: room_id});
    if (e.keyCode == 13) {
      handleUpload();
      if (message.replace(/\s/g, '').length) {
        socket.emit("c_stop", {room_id: room_id})
        setChat((chat) => [...chat,{user:user, message:message}]);
        socket.emit("c_msg", {room_id:room_id, message:message});
        setMessage("");
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

  function ChatMessageItem({data}) {
    if (data.user) {
      if (data.filename) {
        return (
          <div className={user == data.user ? 'chat-message-container my-messages' : 'chat-message-container'}>
            <div>
              <p className='chat-user'>{data.user}</p>
              <a className='chat-message'
                href={`data:application/octet-stream;base64,${btoa(String.fromCharCode(...new Uint8Array(data.buffer)))}`}
                download={data.filename}
              >
                {data.filename}
              </a>
            </div>
          </div>
        )
      }
      return (
        <div className={user == data.user ? 'chat-message-container my-messages' : 'chat-message-container'}>
          <div>
            <p className='chat-user'>{data.user}</p><p className='chat-message'>{data.message}</p>
          </div>
        </div>
      )
    }
  }

  function countText() {
    if (count == 1) {
      return `${count} chatter`
    }
    return `${count} chatters`
  }

  function handleUpload()  {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const buffer = event.target.result;
        socket.emit('c_file', { room_id: room_id, filename: file.name, buffer: buffer });
      };
      reader.readAsArrayBuffer(file);
      setFile(null);
      const uploadInput = document.getElementById('chat-upload');
      if (uploadInput) uploadInput.value = '';
    }
  };

  return (
    <div className='chat-container'>
      <ul id="chat-messages" className="hide-scrollbar">
        {chat.map((data, index) => <ChatMessageItem key={index} data={data}/>)}
      </ul>
      <Typing/>
      <form className="chat-form" onKeyDown={e => handleKeyDown(e)} onKeyUp={e => handleKeyUp(e)}>
        <div className='chat-text-container'>
          <textarea className="chat-text" value={message} autoComplete="off" placeholder={"send a message"} onChange={e => setMessage(e.target.value)}/>
          <div className="file-upload-container">
            <label htmlFor="chat-upload" className="chat-upload-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
              <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
            </svg>
            </label>
            <input id="chat-upload" type="file" onChange={e => setFile(e.target.files[0])} />
          </div>
          <div className='chat-room-counter'>{countText()}</div>
        </div>
      </form>
    </div>
  )
}