import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get('/rooms');
        setRooms(res.data);
      } catch (error) {
        setError('Error fetching rooms');
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleBookNow = (room) => {
    // Redirect to the Booking component with room details
    navigate('/booking', { state: { room } });
  };

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{marginTop:'100px'}}>
    <div className="container mt-5 text-center">
      <h1 className="text-center mb-4">Available Rooms</h1>
      <div className="row">
        {rooms.map((room) => (
          <div key={room.id} className="col-md-4 mb-4">
            <div className="card">
              <img className="card-img-top img-fluid" src={room.image_url} alt={room.room_no} />
              <div className="card-body">
                <h2 className="card-title">{room.room_type}</h2>
                <h2 className="card-title">{room.room_no}</h2>
                <p className="card-text">{room.capacity} persons</p>
                <p className="card-text">
                  Status: {room.status ? <span className='text-success'>Available</span> : 'Booked'}
                </p>
                <p className='card-text'>Price: ${room.price_per_hour}</p>
                <button 
                  className='btn btn-outline-warning text-dark hover-btn' 
                  onClick={() => handleBookNow(room)}
                  disabled={!room.status} // Disable button if room is booked
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>
        {`
          .card:hover .hover-btn {
            background-color: #ffc107; 
            color: white; 
          }
        `}
      </style>
    </div>
    </div>
  );
};

export default Rooms;
