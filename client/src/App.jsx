import { useEffect, useState } from 'react'
import {io} from "socket.io-client"
import './index.css'
import Header from "./components/Header";
import {Outlet} from "react-router-dom";

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(io("http://localhost:3000"));
  }, []);

  return (
    <div id="app" className="dark">
      <Header/>
      <Outlet context={{ socket }}/>
    </div>
  )
}

export default App
