import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'


const GymCard = ({room, index}) => {
    return(
       <Link to= {'/rooms/' + room._id} onClick={()=> scrollTo(0,0)} key={room._id} 
       className='relative max-w-70 w-full rounded-full] 
        overflow-hidden bg-white text-gray-500/90 shadow-[Opx_4px_4px_rgba (0,0,0,0.05) 1'>
        <img src={room.images[0]} alt="" />

        { index % 2 === 0 && <p className='px-3 py-1 absolute top-3 left-3 text-xs 
        bg-white text-gray-800 font-medium rounded-full'>Best Seller</p>}

        <div className='p-4 pt-5'>
            <div className='flex items-center justify-between'>
                <p className=' font-pplayfair text-xl font-mdeium tet-grey-800'></p>
                    {room.hotel.name}
                    <div className='flex items-center gap-1'>
                        <img src={assets.starIconFilled} alt="star-icon"/> 4.9
                    </div>
            </div>
            <div>
                <img src={assets.locationIcon} alt="location-icon"/> 
                <span>{room.hotel.address}</span>
            </div>
            <div className='flex items-center justify-between mt-4'>
            <p><span className='text-xl text-gray-800'>${room.pricePerMonth}</span>/Month</p>
            <button className='px-4 py-2 text-sm font-medium border border-gray-300 rounded
             hover:bg-gray-50 transition-all cursor-pointer'>Book Now</button>
            </div>
        </div>
       </Link>
    )
}

export default GymCard