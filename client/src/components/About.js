import React from 'react';

const About = () => {
    return (
        <div style={{ marginTop: '100px' }}>
            <div className="container my-5">
                <h1 className="text-center mb-4">About Us</h1>
                <div className="row">
                    <div className="col-md-6 mb-4">
                        <h2>Our Mission</h2>
                        <p>
                            At NestFinder, our mission is to provide the best room-finding experience
                            for users seeking comfortable and affordable accommodations. We strive
                            to connect people with their ideal living spaces through our innovative platform.
                        </p>
                    </div>
                    <div className="col-md-6 mb-4">
                        <h2>Our Vision</h2>
                        <p>
                            We envision a world where finding a home is as easy as a click. Our
                            goal is to revolutionize the way people search for rooms, making it
                            accessible and straightforward for everyone.
                        </p>
                    </div>
                </div>
                <h2 className="text-center my-4">Meet Our Team</h2>
                <div className="row">
                    <div className="col-md-4 text-center mb-4">
                        <div className="card">
                            <img src="https://images.pexels.com/photos/13820231/pexels-photo-13820231.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" className="card-img-top" alt="Team Member 1" />
                            <div className="card-body">
                                <h5 className="card-title">John Doe</h5>
                                <p className="card-text">CEO & Founder</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 text-center mb-4">
                        <div className="card">
                            <img src="https://images.pexels.com/photos/4872054/pexels-photo-4872054.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" className="card-img-top" alt="Team Member 2" />
                            <div className="card-body">
                                <h5 className="card-title">Jane Smith</h5>
                                <p className="card-text">CTO</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 text-center mb-4">
                        <div className="card">
                            <img src="https://images.pexels.com/photos/5236610/pexels-photo-5236610.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" className="card-img-top" alt="Team Member 3" />
                            <div className="card-body">
                                <h5 className="card-title">Emily Johnson</h5>
                                <p className="card-text">Marketing Manager</p>
                            </div>
                        </div>
                    </div>
                </div>
                <h2 className="text-center my-4">Our Values</h2>
                <div className="row">
                    <div className="col-md-3 mb-4">
                        <div className="card text-center">
                            <div className="card-body">
                                <i className="fas fa-check-circle fa-2x mb-2"></i>
                                <h5 className="card-title">Integrity</h5>
                                <p className="card-text">We uphold the highest standards of honesty and accountability.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mb-4">
                        <div className="card text-center">
                            <div className="card-body">
                                <i className="fas fa-lightbulb fa-2x mb-2"></i>
                                <h5 className="card-title">Innovation</h5>
                                <p className="card-text">We constantly seek new ideas to improve our services.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mb-4">
                        <div className="card text-center">
                            <div className="card-body">
                                <i className="fas fa-smile fa-2x mb-2"></i>
                                <h5 className="card-title">Customer Satisfaction</h5>
                                <p className="card-text">We are dedicated to meeting the needs of our users.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mb-4">
                        <div className="card text-center">
                            <div className="card-body">
                                <i className="fas fa-users fa-2x mb-2"></i>
                                <h5 className="card-title">Community Engagement</h5>
                                <p className="card-text">We actively contribute to and support our local communities.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
