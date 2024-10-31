import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../services/api';
import { useUser } from './UserContext';
import { ThreeDots } from 'react-loader-spinner';

const Booking = () => {
  const location = useLocation();
  const room = location.state?.room;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [totalPrice, setTotalPrice] = useState(null); 
  const { currentUser } = useUser();

  // Set initial form values, using currentUser's username for the name
  const initialValues = {
    name: currentUser ? currentUser.username : '', // Current user's username as default
    roomId: room ? room.id : '',
    startTime: '',
    endTime: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    roomId: Yup.string().required('Required'),
    startTime: Yup.date().required('Required').nullable(),
    endTime: Yup.date()
      .required('Required')
      .nullable()
      .min(Yup.ref('startTime'), 'End time must be later than start time'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    const apiUrl = '/bookings';
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await api.post(apiUrl, {
        user_id:currentUser.usename,
        room_id: values.roomId,
        check_in: values.startTime,
        check_out: values.endTime,
      });

      if (response.status === 201) {
        setSuccessMessage(`Booking successful! Booking ID: ${response.data['booked:id']}`);
        setTotalPrice(response.data.total_price);
        resetForm(); // Clear form after successful submission
      } else {
        setError(`Error: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error during booking:', error);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '100px' }}>
      <div className="container mt-5">
        <h1 className="text-center mb-4">Book Your Room</h1>
        <div className="row">
          {room && (
            <div className="col-md-6 mb-4">
              <h2 className='text-center'>Room Information</h2>
              <img className='img-fluid' src={room.image_url} alt={room.room_no} style={{ width: '100%', height: 'auto' }} />
              <p><strong>Room Type:</strong> {room.room_type}</p>
              <p><strong>Room Number:</strong> {room.room_no}</p>
              <p><strong>Capacity:</strong> {room.capacity} persons</p>
              <p><strong>Status:</strong> {room.status ? 'Available' : 'Booked'}</p>
              <p><strong>Price per Hour:</strong> ${room.price_per_hour}</p>
            </div>
          )}

          <div className="col-md-6 mb-4">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {() => (
                <Form>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name:</label>
                    <Field type="text" name="name" className="form-control" id="name" />
                    <ErrorMessage name="name" component="div" className="text-danger" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="roomId" className="form-label">Room ID:</label>
                    <Field type="text" name="roomId" className="form-control" id="roomId" readOnly />
                    <ErrorMessage name="roomId" component="div" className="text-danger" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="startTime" className="form-label">Start Time:</label>
                    <Field type="datetime-local" name="startTime" className="form-control" id="startTime" />
                    <ErrorMessage name="startTime" component="div" className="text-danger" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="endTime" className="form-label">End Time:</label>
                    <Field type="datetime-local" name="endTime" className="form-control" id="endTime" />
                    <ErrorMessage name="endTime" component="div" className="text-danger" />
                  </div>
                  {error && <div className="text-danger">{error}</div>}
                  {successMessage && <div className="text-success">{successMessage}</div>}
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? <ThreeDots color="#00BFFF" height={30} width={30} /> : 'Book Now'}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
