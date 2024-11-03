import React from 'react';
import { useNavigate } from 'react-router-dom';
import room1 from '../assets/pexels-heyho-6980715.jpg'
import room2 from '../assets/pexels-douglas-rafael-fonseca-66737161-12870149.jpg'
import room3 from '../assets/room2.jpg'


const Home = () => {
    const navigate = useNavigate();

    const handleNavigateRoom = () => {
        navigate('/rooms');
    };

    return (
        <div style={{ marginTop: '50px' }}>
            <div
                className="container-fluid bg-light text-dark"
                style={{
                    backgroundImage: "url('https://images.pexels.com/photos/2790223/pexels-photo-2790223.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '100vh', 
                    backgroundRepeat: 'no-repeat', 
                    position: 'relative',
                }}
            >
                <header className="text-center py-5">
                    <h1 className="display-4">Book Your Perfect Room</h1>
                    <p className="lead">Discover a range of rooms tailored for your needs.</p>
                    <button className="btn btn-primary btn-lg" onClick={handleNavigateRoom}>
                        View Rooms
                    </button>
                </header>

                <section className="py-5" id="rooms">
                    <div className="container">
                        <h2 className="text-center mb-4">Featured Rooms</h2>
                        <div className="row">
                            <div className="col-md-4 mb-4">
                                <div className="card bg-primary text-white">
                                    <img src={room1} className="card-img-top" alt="Deluxe Suite" />
                                    <div className="card-body">
                                        <h5 className="card-title">Deluxe Suite</h5>
                                        <p className="card-text">A luxurious suite with all amenities.</p>
                                        <button className="btn btn-success" onClick={handleNavigateRoom}>
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-4">
                                <div className="card bg-info text-white">
                                    <img src={room2} className="card-img-top" alt="Standard Room" />
                                    <div className="card-body">
                                        <h5 className="card-title">Standard Room</h5>
                                        <p className="card-text">Comfortable and affordable.</p>
                                        <button className="btn btn-success" onClick={handleNavigateRoom}>
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-4">
                                <div className="card bg-warning text-dark">
                                    <img src={room3} className="card-img-top" alt="Family Room" />
                                    <div className="card-body">
                                        <h5 className="card-title">Family Room</h5>
                                        <p className="card-text">Perfect for families with children.</p>
                                        <button className="btn btn-success" onClick={handleNavigateRoom}>
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;
