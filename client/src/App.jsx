import { useEffect, useState } from 'react'
import {io} from "socket.io-client"
import './index.css'
import Header from "./components/Header";
import {Outlet} from "react-router-dom";

function App() {
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setSocket(io("http://localhost:3000"));
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setUser(e.target[0].value);
  }
  
  function Chatroom(props) {
    if (props.user) {
      return <Outlet context={{socket:props.socket, user:props.user}}/>
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
