import { useEffect, useState } from 'react'
import { useOutletContext, useParams } from "react-router-dom";
import { Link, Form } from 'react-router-dom';
export default function Header() {
  const [roomId, setRoomId] = useState("")

  return (
    <header>
      <nav className="navbar">
        <a className="navbar-mjleedev" href='https://mjlee.dev'> mjlee.dev </a>
        <Form className="navbar-room-form" method="get" action={`/room/${roomId}`}>
          <input className="navbar-room-input"
            placeholder='join a room'
            type="text"
            onChange={(e) => setRoomId(e.target.value)}
          />
        </Form>
      </nav>
    </header>
  )
}``