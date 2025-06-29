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

const App =()=> {

  const isOwnerPath = useLocation().pathname.includes("owner");
  return(
    <div>
      {!isOwnerPath && <Navbar/>}
      {false && <GymReg/>}
      <div className='min-h-[70vh'>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/rooms' element={<AllGyms/>}/>
          <Route path='/gyms/:id' element={<GymDetails/>}/>
          <Route path='/my-bookings' element={<MyBookings/>}/>
          <Route path='/owner' element={<Layout/>}>
            <Route index element={<Dashboard/>}/>
            <Route index element={<AddRoom/>}/>
            <Route index element={<ListRoom/>}/>
          </Route>
        </Routes>
      </div>

      <Footer/>
      
    </div>
  )
}

export default App