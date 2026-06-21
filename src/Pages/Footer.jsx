import React from 'react'
import { NavLink } from 'react-router-dom'

function Footer() {

  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-8 px-6 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">

        {/* Logo Section */}
        <div className="text-2xl font-bold">
          <NavLink to="/" className="flex items-center space-x-1 tracking-tight">
            <span className="bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent font-extrabold">Auctio</span>
            <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent font-extrabold">Nex</span>
          </NavLink>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          <NavLink
            to="/about"
            className="text-slate-400 hover:text-teal-400 transition-colors text-sm font-medium"
          >
            About Us
          </NavLink>
          <NavLink
            to="/contact"
            className="text-slate-400 hover:text-teal-400 transition-colors text-sm font-medium"
          >
            Contact
          </NavLink>
          <NavLink
            to="/privacy-policy"
            className="text-slate-400 hover:text-teal-400 transition-colors text-sm font-medium"
          >
            Privacy Policy
          </NavLink>
          <NavLink
            to="/terms-and-conditions"
            className="text-slate-400 hover:text-teal-400 transition-colors text-sm font-medium"
          >
            Terms & Conditions
          </NavLink>
        </div>

        {/* Social Media Links */}
        <div className="flex space-x-4">
          <a href="https://www.facebook.com/share/1EUYrSabwz/" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 text-slate-400 hover:text-teal-400 hover:bg-slate-700/50 rounded-lg transition-all duration-200 border border-slate-700/30" title="Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 2h-3.5a4.5 4.5 0 00-4.5 4.5v3H7v4h3v8h4v-8h3l1-4h-4v-2a1 1 0 011-1h3V2z" />
            </svg>
          </a>
          <a href="https://x.com/soban_204" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 text-slate-400 hover:text-teal-400 hover:bg-slate-700/50 rounded-lg transition-all duration-200 border border-slate-700/30" title="Twitter/X">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 19c7.732 0 12-6.372 12-11.943v-.543A8.293 8.293 0 0022 4.79a8.2 8.2 0 01-2.356.633A4.109 4.109 0 0021.447 3a8.233 8.233 0 01-2.606.992 4.109 4.109 0 00-7.019 3.743A11.654 11.654 0 013 3.924a4.109 4.109 0 001.271 5.476A4.077 4.077 0 012 8.768v.05A4.109 4.109 0 004.107 13a4.074 4.074 0 01-1.85.07 4.109 4.109 0 003.835 2.85A8.23 8.23 0 012 17.539a11.6 11.6 0 006.29 1.833" />
            </svg>
          </a>
          <a href="mailto:msobansikandar@gmail.com" className="p-2 bg-slate-800 text-slate-400 hover:text-teal-400 hover:bg-slate-700/50 rounded-lg transition-all duration-200 border border-slate-700/30" title="Gmail">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="mt-6 border-t border-slate-800 pt-6 text-center text-slate-500 text-xs">
        &copy; {new Date().getFullYear()} AuctioNex. All Rights Reserved.
      </div>
    </footer>

  )
}

export default Footer
