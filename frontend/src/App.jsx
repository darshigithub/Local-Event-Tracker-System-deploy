import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register"; 
import EventDashboard from "./pages/EventDashboard";
import CreateEvent from "./pages/CreateEvent";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<EventDashboard />} />
      <Route path="/create-event" element={<CreateEvent />} />
    </Routes>
  );
}
