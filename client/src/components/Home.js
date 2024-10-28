import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {

    const navigate = useNavigate()
    const navigateRoom = () =>{
        navigate('/rooms')
    }
  return (
    <div
      style={{
        backgroundImage: "url('https://img.freepik.com/free-photo/white-screen-mobile-phone-cactus-plant-side-table_23-2148161191.jpg?ga=GA1.1.2082882363.1730063465&semt=ais_hybrid')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh', 
        position: 'relative',
      }}
    >
      {/* Semi-transparent overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <div className='d-flex justify-content-center align-items-center flex-column' style={{ height: '100%' }}>
        <h1 className="text-light fw-bolder">Welcome to Our Hotel</h1>
        <p className="text-light">Enjoy Your Room</p>
        <button  className='btn  bg-primary' onClick={navigateRoom}>Book Now</button>
      </div>
    </div>
  );
};

export default Home;

