import {  BrowserRouter, Routes,Route } from "react-router-dom";

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Events from "./pages/Events"
import EventDetails from "./pages/EventDetails";
import OrganiserDashboard from "./pages/OrganiserDashboard";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";

function App(){
  return(
    <BrowserRouter>
    <Navbar />
    <Routes>

    <Route path="/" element={<Home />} />

    <Route path="/events" element={<Events />} />

    <Route
        path="/events/:id"
        element={<EventDetails />}
    />

    <Route path="/login" element={<Login />} />

    <Route path="/register" element={<Register />} />

    <Route
    path="/organiser/dashboard"
    element={<OrganiserDashboard />}/>
    <Route
    path="/organiser/events/create"
    element={<CreateEvent />}/>

    <Route
    path="/organiser/events/edit/:id"
    element={<EditEvent />}/>

    </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App