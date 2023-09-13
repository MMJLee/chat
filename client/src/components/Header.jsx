import { useEffect,useState } from 'react'
import { Form, useNavigate, useParams } from 'react-router-dom';



export default function Header() {
  const [roomId, setRoomId] = useState("")
  const params = useParams();
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!params.room_id) return;
    setRoomId(params.room_id);
  }, [params.room_id]);

  useEffect(() => {
    const timer = setInterval(() => getCount(), 3000);
    return () => clearInterval(timer);
  },[]);

  function getCount() {
    if (params.room_id) {
      // fetch(`https://api.mjlee.dev/count/${params.room_id}`)
      fetch(`http://localhost:3000/count/${params.room_id}`)
      .then(response => response.json())
      .then(json => setCount(json.count))
      .catch(error => console.error(error));
    }
    return 
  }

  const navigate = useNavigate();
  const refreshPage = () => {
    navigate(0);
  }
  
  return (
    <header>
      <nav className="navbar">
        <a className="navbar-mjleedev" href='https://mjlee.dev'> mjlee.dev </a>
        <Form className="navbar-room-form" method="get" action={`/${roomId}`} onSubmit={refreshPage}>
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