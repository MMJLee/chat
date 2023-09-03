import { useEffect, useState } from 'react'
import {io} from "socket.io-client"
import './App.css'

function App() {
  const [socket, setSocket] = useState(null)
  const [message, setMessage] = useState("")

  useEffect(()=> {
    setSocket(io("http://localhost:3000"))
  },[])

  function handleSubmit(e) {
    e.preventDefault();
    console.log(message);
    socket.emit('message', message);
    setMessage("");
  }

  return (
    <div id="app">
      <ul id="messages"></ul>
      <form id="form" onSubmit={handleSubmit}>
        <textarea id="input" name="message" value={message} autoComplete="off" placeholder='send a message'onChange={(e) => setMessage(e.target.value)}/>
        <button type="submit">Send</button>
      </form>
    </div>
    )
  }

export default App
