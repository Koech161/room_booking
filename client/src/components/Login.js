import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import api from '../services/api'; 
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './AuthProvider';

const Login = () => {
    const navigate = useNavigate();
    const {login} = useAuth()

    const initialValues = {
        email: '',
        password: '',
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email format')
            .required('Email is required'),
        password: Yup.string()
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters'),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm}) => {
        try {
            const res = await api.post('/login', values);
            console.log("Login response:", res.data);
            const {token, userId} = res.data
            login(token, userId )
            toast.success(res.data.message || 'Login successful!'); 
            setSubmitting(false);
            resetForm()
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Login failed'); 
            setSubmitting(false);
        }
    };

    return (
        <div className='container d-flex justify-content-center align-items-center vh-100'>
            <div className='card' style={{ width: '30rem', backgroundColor: '#fff' }}>
                <div className='card-body'>
                    <h2 className='card-title text-center'>Login</h2>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <div className='mb-3'>
                                    <label htmlFor='email'>Email</label>
                                    <Field
                                        type='email'
                                        name='email'
                                        className='form-control'
                                    />
                                    <ErrorMessage name='email' component='div' className='text-danger' />
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor='password'>Password</label>
                                    <Field
                                        type='password'
                                        name='password'
                                        className='form-control'
                                    />
                                    <ErrorMessage name='password' component='div' className='text-danger' />
                                </div>
                                <button type='submit' className='btn bg-primary text-white w-100' disabled={isSubmitting}>
                                    {isSubmitting ? 'Logging in...' : 'Login'}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Login;
