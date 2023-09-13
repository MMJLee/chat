import { useEffect, useState } from 'react'
import {io} from "socket.io-client"
import './index.css'
import Header from "./components/Header";
import {Outlet} from "react-router-dom";

function App() {
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setSocket(io(import.meta.env.VITE_SERVER_URL, {withCredentials:true}));
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setUser(e.target[0].value);
  }
  
  function Chatroom({socket, user}) {
    if (user) {
      return <Outlet context={{socket:socket, user:user}}/>
    } else {
      return (
        <form className="username-form" onSubmit={handleSubmit}>
          <input className="username-input" placeholder='select a username'></input>
        </form>
      )       
    }
  }

  return (
    <div id="app" className="dark">
      <Header/>
      <Chatroom socket={socket} user={user}/>
    </div>
  )
}

export default App
