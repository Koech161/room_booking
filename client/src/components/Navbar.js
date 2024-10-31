import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img
            className="img-fluid"
            src="https://imgs.search.brave.com/fXDXpByKIVknd3xQ9D0Oycg7FZvuy3OG0RN9Y0Ga2RE/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9hcC5y/ZGNwaXguY29tL2Iy/NDU4YzQ2ZjU4MzEz/ODI2MTUwMjdhZjU3/NzZjNmI3by1iMjI3/NDQ2NTcwNXMuanBn"
            alt="logo"
            style={{ width: '40px', height: '40px' }}
          />
        </Link>
        <div className="collapse navbar-collapse">
          <div className="navbar-nav">
            <Link className="nav-link" to="/">Home</Link>
            <Link className="nav-link" to="/rooms">Rooms</Link>
            <Link className="nav-link" to="/login">Sign In</Link>
            <Link className="nav-link" to="/register">Sign Up</Link>
            <Link className="nav-link" to="http://127.0.0.1:5555/admin">Admin</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
