import { useEffect,useState } from 'react'
import { Form,useParams } from 'react-router-dom';

export default function Header() {
  const [roomId, setRoomId] = useState("")
  const {room_id} = useParams();

  useEffect(() => {
    if (!room_id) return;
    setRoomId(room_id);
  }, [room_id]);

  return (
    <header>
      <nav className="navbar">
        <a className="navbar-mjleedev" href='https://mjlee.dev'> mjlee.dev </a>
        <Form className="navbar-room-form" method="get" action={`/room/${roomId}`}>
          <input className="navbar-room-input"
            placeholder='join a room'
            value={roomId}
            type="text"
            onChange={(e) => setRoomId(e.target.value)}
          />
        </Form>
      </nav>
    </header>
  )
}``