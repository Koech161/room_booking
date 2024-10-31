
import { BrowserRouter as Router,Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';

import Rooms from './components/Rooms';
import Home from './components/Home';
import Register from './components/Register';
import Booking from './components/Booking';
import Login from './components/Login';
import { AuthProvider } from './components/AuthProvider';

function App() {
  
  
  return (
    <AuthProvider>
    <Router>
      <Navbar />
      <div >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path='/register' element={<Register />} />
          <Route path='/booking' element={<Booking />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
   
  )
}


export default App;
