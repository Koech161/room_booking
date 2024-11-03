
import { BrowserRouter as Router,Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';

import Rooms from './components/Rooms';
import Home from './components/Home';
import Register from './components/Register';
import Booking from './components/Booking';
import Login from './components/Login';
import ConfirmEmail from './components/ConfirmEmail';
import BookingDetails from './components/BookingDetails';
import { ProtectedRoute } from './components/ProtectedRoute';
import Footer from './components/Footer';
import About from './components/About';


function App() {
  
  
  return (
   
    <Router>
      <Navbar />
      <div >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path='/about' element={<About />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/confirmemail' element={<ConfirmEmail />} />
          <Route path='bookings' element={<ProtectedRoute element={<BookingDetails />} />}/>
          <Route path='/booking' element= {<ProtectedRoute  element={<Booking />}/>}/>
          
          
        </Routes>
      </div>
      <Footer />
    </Router>
    
   
  )
}


export default App;
