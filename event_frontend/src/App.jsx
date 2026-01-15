import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HostEvent from "./pages/HostEvent";
import Booking from "./pages/Booking";
import Profile from "./pages/Profile"; 
import EventDetails from "./pages/EventDetails";
import Payment from "./pages/Payment"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/host" element={<HostEvent />} />
        <Route path="/booking/:eventId" element={<Booking />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/event/:eventId" element={<EventDetails />} />
        <Route path="/payment" element={<Payment />} /> 
      </Routes>
    </Router>
  );
}

export default App;
