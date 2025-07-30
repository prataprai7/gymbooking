
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assets, facilityIcons, roomsDummyData, roomCommonData } from '../assets/assets';
import StarRating from '../components/StarRating';

const GymDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [bookingData, setBookingData] = useState({
        startDate: '',
        expiryDate: '',
        members: 1
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const foundRoom = roomsDummyData.find(room => room._id === id);
        if (foundRoom) {
            setRoom(foundRoom);
            setMainImage(foundRoom.images[0]);
        }
    }, [id]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setBookingData(prev => ({
            ...prev,
            [id]: id === 'members' ? Math.max(1, parseInt(value) || 1) : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validate dates
        if (!bookingData.startDate || !bookingData.expiryDate) {
            alert('Please select both start and expiry dates');
            setIsSubmitting(false);
            return;
        }

        // Create booking object
        const newBooking = {
            _id: `booking-${Date.now()}`,
            hotel: {
                ...room.hotel,
                owner: room.hotel.owner
            },
            room: {
                images: room.images,
                roomType: room.roomType
            },
            checkInDate: bookingData.startDate,
            checkOutDate: bookingData.expiryDate,
            guests: bookingData.members,
            totalPrice: room.pricePerMonth * bookingData.members,
            isPaid: false,
            createdAt: new Date().toISOString()
        };

        try {
            // Save to localStorage
            const existingBookings = JSON.parse(localStorage.getItem('userBookings')) || [];
            const updatedBookings = [...existingBookings, newBooking];
            localStorage.setItem('userBookings', JSON.stringify(updatedBookings));

            // Redirect to My Bookings page
            navigate('/my-bookings', { state: { bookingSuccess: true } });
        } catch (error) {
            console.error('Error saving booking:', error);
            alert('Failed to save booking. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!room) return <div className="flex justify-center items-center h-screen">Loading...</div>;

    return (
        <div className='py-28 md:pb-35 px-4 md:px-16 lg:px-24 xl:px-32'>
            {/* Gym Details Header */}
            <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
                <h1 className='text-3xl md:text-4xl font-playfair'>
                    {room.hotel.name} 
                    <span className='font-inter text-sm'>({room.roomType})</span>
                </h1>
                <p className='text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full'>
                    20% OFF
                </p>
            </div>

            {/* Gym Rating */}
            <div className='flex items-center gap-1 mt-2'>
                <StarRating />
                <p className='ml-2'>200+ reviews</p>
            </div>

            {/* Gym Address */}
            <div className='flex items-center gap-1 mt-2'>
                <img src={assets.locationIcon} alt='location-icon' className='w-4 h-4'/>
                <span>{room.hotel.address}</span>
            </div>

            {/* Gym Images Gallery */}
            <div className='flex flex-col lg:flex-row mt-6 gap-6'>
                <div className='lg:w-1/2 w-full'>
                    <img 
                        src={mainImage} 
                        alt='Main gym view'
                        className='w-full rounded-xl shadow-lg object-cover h-96'
                    />
                </div>
                <div className='grid grid-cols-2 gap-4 lg:w-1/2 w-full'>
                    {room.images.length > 1 && room.images.map((image, index) => (
                        <img 
                            key={index}
                            onClick={() => setMainImage(image)}
                            src={image} 
                            alt={`Gym view ${index + 1}`}
                            className={`w-full h-48 rounded-xl shadow-md object-cover cursor-pointer ${
                                mainImage === image ? 'outline outline-2 outline-orange-500' : ''
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Gym Highlights */}
            <div className='flex flex-col md:flex-row md:justify-between mt-10'>
                <div className='flex flex-col'>
                    <h1 className='text-3xl md:text-4xl font-playfair'>
                        Experience Luxury Like Never Before
                    </h1>
                    <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                        {room.amenities.map((item, index) => (
                            <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100'>
                                <img src={facilityIcons[item]} alt={item} className='w-5 h-5'/>
                                <p className='text-xs'>{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Gym Price */}
                <p className='text-2xl font-medium'>${room.pricePerMonth}/month</p>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleSubmit} className='flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl'>
                <div className='flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500'>
                    <div className='flex flex-col'>
                        <label htmlFor='startDate' className='font-medium'>Start Date</label>
                        <input 
                            type='date' 
                            id='startDate' 
                            value={bookingData.startDate}
                            onChange={handleInputChange}
                            min={new Date().toISOString().split('T')[0]}
                            className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' 
                            required
                        />
                    </div>

                    <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
                    <div className='flex flex-col'>
                        <label htmlFor='expiryDate' className='font-medium'>Expiry Date</label>
                        <input 
                            type='date' 
                            id='expiryDate' 
                            value={bookingData.expiryDate}
                            onChange={handleInputChange}
                            min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                            className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' 
                            required
                        />
                    </div>

                    <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
                    <div className='flex flex-col'>
                        <label htmlFor='members' className='font-medium'>Members</label>
                        <input 
                            type='number' 
                            id='members' 
                            min='1'
                            max='10'
                            value={bookingData.members}
                            onChange={handleInputChange}
                            className='w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none'
                            required
                        />
                    </div>
                </div>

                <button 
                    type='submit' 
                    disabled={isSubmitting}
                    className='bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all text-white rounded-md w-full md:w-auto md:px-12 py-3 text-base cursor-pointer mt-6 md:mt-0 disabled:opacity-70'
                >
                    {isSubmitting ? 'Booking...' : 'Book Now'}
                </button>
            </form>

            {/* Common Specifications */}
            <div className='mt-16 space-y-4'>
                {roomCommonData.map((spec, index) => (
                    <div key={index} className='flex items-start gap-2'>
                        <img src={spec.icon} alt={`${spec.title}-icon`} className='w-6'/>
                        <div>
                            <p className='text-base'>{spec.title}</p>
                            <p className='text-gray-500'>{spec.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Gym Description */}
            <div className='max-w-3xl border-y border-gray-300 my-16 py-10 text-gray-500'> 
                <p>
                    Workout slots are assigned on the ground floor based on availability.
                    Experience our premium gym with a true urban fitness atmosphere. 
                    The listed price is for individual members—adjust the number of members in your group to see accurate pricing.
                    Ground floor training zones are allocated upon availability. 
                    Enjoy our modern, high-energy gym designed for the ultimate city workout experience.
                </p>
            </div>
            
            {/* Host Information */}
            <div className='flex flex-col items-start gap-4 mt-10'>
                <div className='flex gap-4'>
                    <img 
                        src={room.hotel.owner.image} 
                        alt={`${room.hotel.name} owner`} 
                        className='h-14 w-14 md:h-18 md:w-18 rounded-full' 
                    />
                    <div>
                        <p className='text-lg md:text-xl'>Hosted by {room.hotel.owner.name}</p>
                        <div className='flex items-center mt-1'>
                            <StarRating />
                            <p className='ml-2'>200+ reviews</p>
                        </div>
                    </div>
                </div>
                <button className='px-6 py-2.5 mt-4 rounded text-white bg-orange-500 hover:bg-orange-600 transition-all cursor-pointer'>
                    Contact Now
                </button>
            </div>
        </div>
    );
};

export default GymDetails;