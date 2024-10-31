import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../services/api'; // Adjust the path as needed
import emailjs from 'emailjs-com'; // Import EmailJS

const Register = () => {
    const initialValues = {
        username: '',
        email: '',
        password: '',
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        email: Yup.string()
            .email('Invalid email format')
            .required('Email is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
    });

    const handleSubmit = async (values, { setSubmitting, setStatus }) => {
        try {
            const res = await api.post('/register', values);
            setStatus({ success: res.data.message });

            // Send confirmation email using EmailJS
            emailjs.send("service_sghv0ni", "atLh5T_blrpqJ6RqS", {
                to_email: values.email,
                username: values.username,
                confirmation_link: res.data.confirmation_link, // Include the confirmation link from the backend
            }, "atLh5T_blrpqJ6RqS")
            .then((response) => {
                console.log('Email sent successfully:', response.status, response.text);
            }, (err) => {
                console.error('Failed to send email:', err);
            });

            alert('Registration successful! Please check your email to confirm.');
        } catch (error) {
            setStatus({ error: error.response?.data?.error || 'Registration failed' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className='container d-flex justify-content-center align-items-center vh-100'>
            <div className='card' style={{ width: '30rem', backgroundColor: '#fff' }}>
                <div className='card-body'>
                    <h2 className='card-title text-center'>Sign Up</h2>
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
                                    <label htmlFor='username'>Username</label>
                                    <Field
                                        type='text'
                                        name='username'
                                        className='form-control'
                                    />
                                    <ErrorMessage name='username' component='div' className='text-danger' />
                                </div>
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
                                    {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default Register;
