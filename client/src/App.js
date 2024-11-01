
import { BrowserRouter as Router,Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';

import Rooms from './components/Rooms';
import Home from './components/Home';
import Register from './components/Register';
import Booking from './components/Booking';
import Login from './components/Login';
import ConfirmEmail from './components/ConfirmEmail';


function App() {
  
  
  return (
   
    <Router>
      <Navbar />
      <div >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path='/register' element={<Register />} />
          <Route path='/booking' element={<Booking />} />
          <Route path='/login' element={<Login />} />
          <Route path='/confirmemail' element={<ConfirmEmail />} />
        </Routes>
      </div>
    </Router>
    
   
  )
}


export default App;
