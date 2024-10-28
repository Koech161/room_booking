import React, { useEffect, useState } from 'react'
import api from '../services/api'

const Rooms = () => {

    const [rooms, setRooms] = useState([])

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get('/rooms')
        setRooms(res.data)
        console.log(res.data)
      } catch (error) {
        console.error('Error fetching room', error);
        
      }
    }
    fetchBooks()
  }, [])
  return (
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
                  Status: {room.status ? 'Available' : 'Booked'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Rooms
