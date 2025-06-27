import React from 'react'
import {assets} from '../assets/assets'

const GymReg =()=>{
    return(
        <div className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center
        justify-center bg-black/70'>
            <form className='flex bg-white rounded-xl max-w-4xl max-md:mx-2'>
                <img src={assets.regImage} alt="reg-image" className='w-1/2 rounded-xl
                hidden md:block'/>

                <div className='relative flex flex-col items-center md:w-1/2 p-8 md:p-10'>
                    <img src={assets.closeIcon} alt="close-icon" className='absolute top-4
                    right-4 h-4 w-4 cursor-pointer'/>
                    <p className='text-2xl font-semibold mt-6'>Register Your Gym</p>
                </div>
            </form>
        </div>
    )
}

export default GymReg