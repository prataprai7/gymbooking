import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import Title from '../components/Title';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Check for successful booking redirect
        if (location.state?.bookingSuccess) {
            // Clear the state to prevent showing the message again on refresh
            window.history.replaceState({}, '');
        }

        // Load bookings from localStorage
        const savedBookings = JSON.parse(localStorage.getItem('userBookings')) || [];
        setBookings(savedBookings);
    }, [location.state]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handlePayNow = (bookingId) => {
        // Implement payment logic here
        const updatedBookings = bookings.map(booking => 
            booking._id === bookingId ? { ...booking, isPaid: true } : booking
        );
        setBookings(updatedBookings);
        localStorage.setItem('userBookings', JSON.stringify(updatedBookings));
    };

    return (
        <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
            <Title 
                title='My Bookings' 
                subTitle='Easily manage your past, current, and upcoming gym reservations in one place. Plan your trainings seamlessly with just a few clicks' 
                align='left' 
            />

            <div className='max-w-6xl mt-8 w-full text-gray-800'>
                <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3'>
                    <div>Gyms</div>
                    <div>Date & Timings</div>
                    <div>Payment</div>
                </div>

                {bookings.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">You don't have any bookings yet</p>
                        <button 
                            onClick={() => navigate('/gyms')}
                            className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition"
                        >
                            Browse Gyms
                        </button>
                    </div>
                ) : (
                    bookings.map((booking) => (
                        <div key={booking._id} className='grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t'>
                            {/* Gym Details */}
                            <div className='flex flex-col md:flex-row'> 
                                <img 
                                    src={booking.room.images[0]} 
                                    alt="gym-img"
                                    className='w-full md:w-44 h-32 rounded shadow object-cover'
                                />
                                <div className='flex flex-col gap-1.5 md:ml-4 mt-3 md:mt-0'>
                                    <p className='font-playfair text-2xl'>
                                        {booking.hotel.name}
                                        <span className='font-inter text-sm'> ({booking.room.roomType})</span>
                                    </p>
                                    <div className='flex items-center gap-1 text-sm text-gray-500'>
                                        <img src={assets.locationIcon} alt="location-icon"/>
                                        <span>{booking.hotel.address}</span>
                                    </div>
                                    <div className='flex items-center gap-1 text-sm text-gray-500'>
                                        <img src={assets.guestsIcon} alt="guests-icon"/>
                                        <span>{booking.guests} member{booking.guests !== 1 ? 's' : ''}</span>
                                    </div>
                                    <p className='text-base'>Total: ${booking.totalPrice}</p>
                                </div>
                            </div>
                            {/* Date and Time */}
                            <div className='flex flex-row md:items-center md:gap-12 mt-3 gap-8'>
                                <div>
                                    <p>Check-In:</p>
                                    <p className='text-gray-500 text-sm'>
                                        {formatDate(booking.checkInDate)}
                                    </p>
                                </div>
                                <div>
                                    <p>Check-Out:</p>
                                    <p className='text-gray-500 text-sm'>
                                        {formatDate(booking.checkOutDate)}
                                    </p>
                                </div>
                            </div>
                            {/* Payment status */}
                            <div className='flex flex-col items-start justify-center pt-3'>
                                <div className='flex items-center gap-2'>
                                    <div className={`h-3 w-3 rounded-full ${booking.isPaid ? "bg-green-500" : "bg-red-500"}`}></div>
                                    <p className={`text-sm ${booking.isPaid ? "text-green-500" : "text-red-500"}`}>
                                        {booking.isPaid ? "Paid" : "Unpaid"} 
                                    </p> 
                                </div>
                                {!booking.isPaid && (
                                    <button 
                                        onClick={() => handlePayNow(booking._id)}
                                        className='px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer'
                                    >
                                        Pay Now
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyBookings;