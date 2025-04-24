'use client'

import '../styles/header.css'
import { Sun, Cloud, Droplets } from 'lucide-react'

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="icon-group">
          <Sun className="icon" />
          <Cloud className="icon" />
          <Droplets className="icon" />
        </div>
        <h1>Weather Updates App</h1>
      </div>
    </header>
  )
}
