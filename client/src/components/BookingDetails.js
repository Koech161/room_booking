import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { useAuth } from './AuthProvider'
import { useUser } from './UserContext'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { capitilized } from './Navbar';
const BookingDetails = () => {
    const [bookings , setBookings] = useState([])
    const { token} = useAuth()
    const {currentUser} = useUser()

    

    useEffect(() => {
        const fetchBookings = async ()=>{
            try {
                const response = await api.get(`/bookings`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log('Bookings:',response.data);
                const sortedBookings = response.data.sort((a, b) => b.id - a.id)
                setBookings(sortedBookings)
                
                
            } catch (error) {
                toast.error(error.response.data.error ||'Failed to fetch bookings. Please try again later.');
                console.error('Error fetching bookings details:', error);
            }
        }
        fetchBookings()

    },[token])
  return (
    <div style={{ marginTop: '80px' }}>
    <h1 className='text-center mb-4'>{capitilized(currentUser.username)}'s Bookings</h1>
    <div className='container'>
        {bookings.length === 0 ? (
            <p className='text-center'>No bookings found.</p>
        ) : (
            <div className='row'>
                {bookings.map((booking) => (
                    <div className='col-md-4 mb-4' key={booking.id}>
                        <div className='card h-100'>
                            <div className='card-body'>
                                <h5 className='card-title'>Booking ID: {booking.id}</h5>
                                <p className='card-text'>Total Price: ${booking.total_price.toFixed(2)}</p>
                                <p className='card-text'>From: {new Date(booking.check_in).toLocaleDateString()}</p>
                                <p className='card-text'>To: {new Date(booking.check_out).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
    <ToastContainer />
</div>
  )
}

export default BookingDetails
