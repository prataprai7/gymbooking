import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home';
import Footer from './components/Footer';
import AllGyms from './pages/AllGyms';
import GymDetails from './pages/GymDetails';

const App =()=> {

  const isOwnerPath = useLocation().pathname.includes("owner");
  return(
    <div>
      {!isOwnerPath && <Navbar/>}
      <div className='min-h-[70vh'>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/rooms' element={<AllGyms/>}/>
          <Route path='/gyms/:id' element={<GymDetails/>}/>
        </Routes>
      </div>

      <Footer/>
      
    </div>
  )
}

export default App