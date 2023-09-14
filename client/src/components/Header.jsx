import { useEffect,useState } from 'react'
import { Form, useParams } from 'react-router-dom';

export default function Header() {
  const [roomId, setRoomId] = useState("")
  const [count, setCount] = useState(0)
  const params = useParams();

  useEffect(() => {
    if (!params.room_id) return;
    setRoomId(params.room_id);
  }, [params.room_id]);

  useEffect(() => {
    const timer = setInterval(() => getCount(), 3000);
    return () => clearInterval(timer);
  },[]);

  useEffect(() => {
    let url = window.location.href;
    if( url.endsWith("?") ) { url = url.substring( 0, url.length-1 ); }
    window.history.pushState( {"page":"TheSamePage"}, "TheSamePage", url );
  },[window.location.href]);

  function getCount() {
    if (params.room_id) {
      fetch(`${import.meta.env.VITE_SERVER_URL}/chat/count/${params.room_id}`)
      .then(response => response.json())
      .then(json => setCount(json.count))
      .catch(error => console.error(error));
    } else {
      fetch(`${import.meta.env.VITE_SERVER_URL}/chat/count`)
      .then(response => response.json())
      .then(json => setCount(json.count))
      .catch(error => console.error(error));
    }
    return 
  }

  return (
    <header>
      <nav className="navbar">
        <a className="navbar-mjleedev" href='https://mjlee.dev'> mjlee.dev </a>
        <Form reloadDocument className="navbar-room-form" method="get" action={`/${roomId}`}>
          <p className='navbar-room-count'
            onClick={() => {navigator.clipboard.writeText('https://chat.mjlee.dev/'+roomId)}}
          >{count}</p>
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