import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HostEvent from "./pages/HostEvent";
import Booking from "./pages/Booking";
import EventDetails from "./pages/EventDetails";
import Payment from "./pages/Payment";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import ChatBot from "./components/ChatBot";
// import HostInventory from "./pages/HostInventory";

function App() {
  return (
    <Router>
      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/host" element={<HostEvent />} />
        <Route path="/booking/:eventId" element={<Booking />} />
        <Route path="/event/:eventId" element={<EventDetails />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
        {/* <Route path="/host/inventory" element={<HostInventory />} /> */} 
      </Routes>

      {/* ✅ Global ChatBot (visible on all pages) */}
      <ChatBot />
    </Router>
  );
}

export default App;