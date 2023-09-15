import { useEffect, useState } from 'react'
import {io} from "socket.io-client"
import './index.css'
import Header from "./components/Header";
import {Outlet} from "react-router-dom";

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(io(import.meta.env.VITE_SERVER_URL, {path: "/chat/socketio/"}, {withCredentials: true}));
  }, []);

  return (
    <div id="app" className="dark">
      <Header/>
      <Outlet context={{socket:socket}}/>
    </div>
  )
}

export default App
