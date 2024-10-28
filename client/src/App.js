
import { BrowserRouter as Router,Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';

import Rooms from './components/Rooms';
import Home from './components/Home';

function App() {
  
  
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
        </Routes>
      </div>
    </Router>
   
  )
}


export default App;
