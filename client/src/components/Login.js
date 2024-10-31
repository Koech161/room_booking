import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import api from '../services/api'; // Adjust the path as needed
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate()
    const initialValues = {
        email: '',
        password: '',
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email format')
            .required('Email is required'),
        password: Yup.string()
            .required('Password is required'),
    });

    const handleSubmit = async (values, { setSubmitting, setStatus }) => {
        try {
            const res = await api.post('/login', values);
            setStatus({ success: res.data.message });
            // Handle successful login (e.g., redirect, store token, etc.)
            alert('Login successful!');
            setSubmitting(false);
            navigate('/')
            
        } catch (error) {
            setStatus({ error: error.response?.data?.error || 'Login failed' });
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
                        {({ isSubmitting, status }) => (
                            <Form>
                                {status?.success && <div className='alert alert-success'>{status.success}</div>}
                                {status?.error && <div className='alert alert-danger'>{status.error}</div>}
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
        </div>
    );
};

export default Login;
