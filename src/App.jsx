import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home';
import Footer from './components/Footer';
import AllGyms from './pages/AllGyms';

const App =()=> {

  const isOwnerPath = useLocation().pathname.includes("owner");
  return(
    <div>
      {!isOwnerPath && <Navbar/>}
      <div className='min-h-[70vh'>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/gyms' element={<AllGyms/>}/>

        </Routes>
      </div>
      <Footer/>
    </div>
  )
}

export default App