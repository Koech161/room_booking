import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import { useAuth } from './AuthProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const capitilized = (string) =>{
  if (!string) return ""
  return string.charAt(0).toUpperCase() + string.slice(1)
}
  
const Navbar = () => {
  const {currentUser} = useUser()
  const {logout, isAuthenticated} = useAuth()
  const navigate = useNavigate()

  const isAdmin = currentUser.role === 'admin'


  const handleLogout = async () =>{
    await logout()
    toast.warning('Loging Out')
    navigate('/')
  }
 console.log('admin_url:',process.env.REACT_APP_ADMIN_URL);
 
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top" style={{fontSize:'20px'}}>
      <div className="container">
        <Link className="navbar-brand" to="/" style={{fontSize:"30px"}}>
          NestFinder
        </Link>
        <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarNav' aria-controls='navbarNav' aria-expanded='false' aria-label='Toggle navigation'>
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className="collapse navbar-collapse" id='navbarNav'>
        
          <div className="navbar-nav">
            <Link className="nav-link" to="/">Home</Link>
            <Link className="nav-link" to="/rooms">Rooms</Link>
            <Link className="nav-link" to="/about">About Us</Link>
            
            {isAuthenticated && isAdmin ?(
              <a className="nav-link" href={`${process.env.ADMIN_URL}`} target="_blank" rel="noopener noreferrer">Admin</a>
            ): ''}
          {isAuthenticated ? (
            <>
             
             <div className="dropdown">
                  <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                    Welcome, {capitilized(currentUser.username)}
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <li><Link className="dropdown-item" to="/bookings">My Bookings</Link></li>
                    <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                  </ul>
                </div>
            </> 
  

          ): 
          <><Link className="nav-link" to="/login">Sign In</Link>
            <Link className="nav-link" to="/register">Sign Up</Link></>}
         
            
           
             
           
          </div>
        </div>
      </div>
      <ToastContainer />
    </nav>
  );
};

export default Navbar;
