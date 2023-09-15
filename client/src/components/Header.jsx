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

  function handleClick() {
    const appDiv = document.getElementById("app");
    appDiv.classList.toggle("light");
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
        <button class="navbar-theme-button" onClick={handleClick}>
          <svg id="moon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
          <svg id="sun" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        </button>
      </nav>
    </header>
  )
}