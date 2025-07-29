import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home';
import Footer from './components/Footer';
import AllGyms from './pages/AllGyms';
import GymDetails from './pages/GymDetails';
import MyBookings from './pages/MyBookings';
import GymReg from './components/GymReg';
import Layout from './pages/gymOwner/Layout';
import Dashboard from './pages/gymOwner/Dashboard';
import AddRoom from './pages/gymOwner/AddRoom';
import ListRoom from './pages/gymOwner/ListRoom';

const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner");
  
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {!isOwnerPath && <Navbar/>}
      {false && <GymReg/>}
      
      {/* Main content area */}
      <main className="flex-grow">
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/gyms' element={<AllGyms/>}/>
          <Route path='/rooms/:id' element={<GymDetails/>}/>
          <Route path='/my-bookings' element={<MyBookings/>}/>
          <Route path='/owner' element={<Layout/>}>
            <Route index element={<Dashboard/>}/>
            <Route path="add-room" element={<AddRoom/>}/>
            <Route path="list-rooms" element={<ListRoom/>}/>
          </Route>
        </Routes>
      </main>

      {/* Footer */}
      {!isOwnerPath && <Footer/>}
    </div>
  )
}

export default App