import { useEffect, useState } from 'react'
import { useOutletContext, useParams } from "react-router-dom";
import { v4 } from 'uuid'
import { Link } from 'react-router-dom';
export default function Header() {
  const room_id = v4();
  return (
    <header id="app" className="dark">
      <nav id="container">
        <Link to={`/room/${room_id}`}>Homepage</Link>
      </nav>
    </header>
  )
}