import { useEffect,useState } from 'react'
import { Form, useOutletContext, useParams } from 'react-router-dom';

export default function Header() {
  const [roomId, setRoomId] = useState("")
  const {room_id} = useParams();
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!room_id) return;
    setRoomId(room_id);
  }, [room_id]);

  useEffect(() => {
    const timer = setInterval(() => getCount(), 5000);
    return () => clearInterval(timer);
  },[]);

  function getCount() {
    fetch(`https://api.mjlee.dev/count/${room_id}`)
    .then(response => response.json())
    .then(json => setCount(json.count))
    .catch(error => console.error(error));
    return 
  }

  return (
    <header>
      <nav className="navbar">
        <a className="navbar-mjleedev" href='https://mjlee.dev'> mjlee.dev </a>
        <Form className="navbar-room-form" method="get" action={`/${roomId}`}>
          <p className='navbar-room-count'>{count}</p>
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
}