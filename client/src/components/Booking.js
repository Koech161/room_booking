import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../services/api';
import { ThreeDots } from 'react-loader-spinner';
import { useAuth } from './AuthProvider';
import { useUser } from './UserContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Booking = () => {
    const location = useLocation();
    const room = location.state?.room;
    const { userId, currentUser } = useAuth();
    const { token } = useUser();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const initialValues = {
        name: currentUser?.username || '',
        roomId: room ? room.id : '',
        startTime: '',
        endTime: '',
    };

    const validationSchema = Yup.object({
        name: Yup.string(),
        roomId: Yup.string().required('Required'),
        startTime: Yup.date()
            .required('Required')
            .nullable()
            .min(new Date().toISOString().slice(0, 16), 'Start time cannot be in the past'),
        endTime: Yup.date()
            .required('Required')
            .nullable()
            .min(Yup.ref('startTime'), 'End time must be later than start time'),
    });

    const handleSubmit = async (values, { resetForm }) => {
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await api.post('/bookings', {
                user_id: userId,
                room_id: values.roomId,
                check_in: new Date(values.startTime).toISOString(),
                check_out: new Date(values.endTime).toISOString(),
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
                console.log(response.data);
                
            if (response.status === 201) {
                const { total_price } = response.data; 
                toast.success(`Booking successful! Booking ID: ${response.data['booking_id']}, Total Price: $${total_price.toFixed(2)}`);
                resetForm();
            } else {
                setError(`Error: ${response.data.error}`);
            }
        } catch (error) {
            console.error('Error during booking:', error);
            if (error.response) {
                toast.error(`${error.response.data.error}` || 'Room already booked for the selected time');
            } else {
                setError('An unexpected error occurred. Please try again later.');
            }
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
                            {({ isSubmitting }) => (
                                <Form>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Name:</label>
                                        <Field type="text" name="name" className="form-control" id="name" readOnly />
                                        <ErrorMessage name="name" component="div" className="text-danger" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="roomId" className="form-label">Room ID:</label>
                                        <Field type="text" name="roomId" className="form-control" id="roomId" readOnly />
                                        <ErrorMessage name="roomId" component="div" className="text-danger" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="startTime" className="form-label">Start Time:</label>
                                        <Field type="datetime-local" name="startTime" className="form-control" id="startTime" min={new Date().toISOString().slice(0, 16)} />
                                        <ErrorMessage name="startTime" component="div" className="text-danger" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="endTime" className="form-label">End Time:</label>
                                        <Field type="datetime-local" name="endTime" className="form-control" id="endTime" />
                                        <ErrorMessage name="endTime" component="div" className="text-danger" />
                                    </div>
                                    {error && <div className="text-danger">{error}</div>}
                                    {successMessage && <div className="text-success">{successMessage}</div>}
                                    <button type="submit" className="btn btn-primary" disabled={loading || isSubmitting}>
                                        {loading ? <ThreeDots color="#00BFFF" height={30} width={30} /> : 'Book Now'}
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Booking;
