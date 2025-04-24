'use client'

import Link from 'next/link'
import '../styles/footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left: Brand Info */}
        <div className="footer-section">
          <h2 className="footer-title">Weather Updates</h2>
          <p className="footer-text">
            Your trusted source for accurate and timely weather forecasts.
          </p>
        </div>

        {/* Middle: Quick Links */}
        <div className="footer-section">
          <h3 className="footer-subtitle">Quick Links</h3>
          <ul className="footer-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/">About</Link></li>
            <li><Link href="/">Forecast</Link></li>
            <li><Link href="/">Support</Link></li>
          </ul>
        </div>

        {/* Right: Contact Info */}
        <div className="footer-section">
          <h3 className="footer-subtitle">Contact Us</h3>
          <p>weather Support</p>
          
          <p>Location: Nairobi, Kenya</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Weather Updates. All rights reserved.</p>
      </div>
    </footer>
  )
}
