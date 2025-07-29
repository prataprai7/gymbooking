import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
       <div className='bg-[#F6F9FC] text-gray-500/80 pt-8 px-6 md:px-16 lg:px-24 xl:px-32 w-full'>
            <div className='max-w-7xl mx-auto'>
                <div className='flex flex-wrap justify-between gap-12 md:gap-6'>
                    <div className='max-w-80'>
                        <img src={assets.bayam} alt='logo' className='mb-4 h-8 md:h-9'/>
                        <p className='text-sm'>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text
                        </p>
                        <div className='flex items-center gap-3 mt-4'>
                            <img src={assets.instagramIcon} alt="instagram-icon" className='w-6'/>
                            <img src={assets.facebookIcon} alt="facebook-icon" className='w-6'/>
                            <img src={assets.twitterIcon} alt="twitter-icon" className='w-6'/>
                            <img src={assets.linkendinIcon} alt="linkend-icon" className='w-6'/>
                        </div>
                    </div>

                    <div>
                        <p className='font-playfair text-lg text-gray-800'>COMPANY</p>
                        <ul className='mt-3 flex flex-col gap-2 text-sm'>
                            <li><a href="#" className="hover:text-gray-800 transition">About</a></li>
                            <li><a href="#" className="hover:text-gray-800 transition">Careers</a></li>
                            <li><a href="#" className="hover:text-gray-800 transition">Press</a></li>
                            <li><a href="#" className="hover:text-gray-800 transition">Blog</a></li>
                            <li><a href="#" className="hover:text-gray-800 transition">Partners</a></li>
                        </ul>
                    </div>

                    <div>
                        <p className='font-playfair text-lg text-gray-800'>SUPPORT</p>
                        <ul className='mt-3 flex flex-col gap-2 text-sm'>
                            <li><a href="#" className="hover:text-gray-800 transition">Help Center</a></li>
                            <li><a href="#" className="hover:text-gray-800 transition">Safety Information</a></li>
                            <li><a href="#" className="hover:text-gray-800 transition">Cancellation Options</a></li>
                            <li><a href="#" className="hover:text-gray-800 transition">Contact Us</a></li>
                            <li><a href="#" className="hover:text-gray-800 transition">Accessibility</a></li>
                        </ul>
                    </div>

                    <div className='max-w-80'>
                        <p className='font-playfair text-lg text-gray-800'>STAY UPDATED</p>
                        <p className='mt-3 text-sm'>
                            Subscribe to our newsletter for inspiration and special offers.
                        </p>
                        <div className='flex items-center mt-4'>
                            <input 
                                type="text" 
                                className='bg-white rounded-l border border-gray-300 h-9 px-3 outline-none flex-grow' 
                                placeholder='Your email' 
                            />
                            <button className='flex items-center justify-center bg-black h-9 w-9 aspect-square rounded-r hover:bg-gray-800 transition'>
                                <img src={assets.arrowIcon} alt="arrow-icon" className='w-3.5 invert'/>
                            </button>
                        </div>
                    </div>
                </div>
                <hr className='border-gray-300 mt-8' />
                <div className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'>
                    <p className='text-sm'>© {new Date().getFullYear()} BayamBook. All rights reserved.</p>
                    <ul className='flex items-center gap-4 text-sm'>
                        <li><a href="#" className="hover:text-gray-800 transition">Privacy</a></li>
                        <li><a href="#" className="hover:text-gray-800 transition">Terms</a></li>
                        <li><a href="#" className="hover:text-gray-800 transition">Sitemap</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Footer