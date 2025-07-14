import React, { useState } from 'react';
import { assets, facilityIcons, roomsDummyData } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import StarRating from '../components/StarRating';

const CheckBox = ({ label, selected = false, onChange = () => {} }) => {
    return (
        <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
            <input 
                type="checkbox" 
                checked={selected} 
                onChange={(e) => onChange(e.target.checked, label)}
            />
            <span className='font-light select-none'>{label}</span>
        </label>
    );
};

const RadioButton = ({ label, selected = false, onChange = () => {} }) => {
    return (
        <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
            <input 
                type="radio" 
                name='sortOption' 
                checked={selected} 
                onChange={() => onChange(label)}
            />
            <span className='font-light select-none'>{label}</span>
        </label>
    );
};

const AllGyms = () => {
    const navigate = useNavigate();
    const [openFilters, setOpenFilters] = useState(false);
    const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
    const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
    const [sortOption, setSortOption] = useState(null);

    const roomTypes = ["Couple", "Group", "Student", "Elderly"];
    const priceRanges = ['0 to 5', '10 to 25', '30 to 50', '70 above'];
    const sortOptions = ["Price Low to High", "Price High to Low", "Newest First"];

    const handleRoomTypeChange = (checked, type) => {
        if (checked) {
            setSelectedRoomTypes([...selectedRoomTypes, type]);
        } else {
            setSelectedRoomTypes(selectedRoomTypes.filter(t => t !== type));
        }
    };

    const handlePriceRangeChange = (checked, range) => {
        if (checked) {
            setSelectedPriceRanges([...selectedPriceRanges, range]);
        } else {
            setSelectedPriceRanges(selectedPriceRanges.filter(r => r !== range));
        }
    };

    const handleSortChange = (option) => {
        setSortOption(option);
    };

    const clearFilters = () => {
        setSelectedRoomTypes([]);
        setSelectedPriceRanges([]);
        setSortOption(null);
    };

    const filterAndSortRooms = () => {
        let filteredRooms = [...roomsDummyData];

        // Apply room type filters
        if (selectedRoomTypes.length > 0) {
            filteredRooms = filteredRooms.filter(room => 
                selectedRoomTypes.includes(room.roomType)
            );
        }

        // Apply price range filters
        if (selectedPriceRanges.length > 0) {
            filteredRooms = filteredRooms.filter(room => {
                return selectedPriceRanges.some(range => {
                    const [min, max] = range.split(' to ').map(Number);
                    if (range.includes('above')) {
                        return room.pricePerMonth >= 70;
                    }
                    return room.pricePerMonth >= min && room.pricePerMonth <= max;
                });
            });
        }

        // Apply sorting
        if (sortOption) {
            filteredRooms.sort((a, b) => {
                if (sortOption === "Price Low to High") {
                    return a.pricePerMonth - b.pricePerMonth;
                } else if (sortOption === "Price High to Low") {
                    return b.pricePerMonth - a.pricePerMonth;
                } else if (sortOption === "Newest First") {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                }
                return 0;
            });
        }

        return filteredRooms;
    };

    const filteredRooms = filterAndSortRooms();

    return (
        <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>
            <div className='w-full lg:w-3/4'>
                <div className='flex flex-col items-start text-left'>
                    <h1 className='font-playfair text-4xl md:text-[40px]'>Gym Rooms</h1>
                    <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-174'>
                        Take advantage of our limited-time offers and special packages 
                        to enhance your stay and create unforgettable memories.
                    </p>
                </div>

                {filteredRooms.map((room) => (
                    <div key={room._id} className='flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0'>
                        <img 
                            onClick={() => {
                                navigate(`/rooms/${room._id}`); 
                                window.scrollTo(0, 0);
                            }}
                            src={room.images[0]} 
                            alt="gyms-img" 
                            title='View Gym Details'
                            className='max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer'
                        />
                        <div className='md:w-1/2 flex flex-col gap-2'>
                            <p className='text-gray-500'>{room.hotel.city}</p>
                            <p 
                                onClick={() => {
                                    navigate(`/rooms/${room._id}`); 
                                    window.scrollTo(0, 0);
                                }}
                                className='text-gray-800 text-3xl font-playfair cursor-pointer'
                            >
                                {room.hotel.name}
                            </p>
                            <div className='flex items-center'>
                                <StarRating rating={room.rating} />
                                <p className='ml-2'>{room.reviews}+ reviews</p>
                            </div>    
                            <div className='flex items-center gap-1 text-gray-500 mt-2 text-sm'>
                                <img src={assets.locationIcon} alt='location-icon'/>
                                <span>{room.hotel.address}</span>
                            </div>
                            {/* Gym Amenities */}
                            <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                                {room.amenities.map((item, index) => (
                                    <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70'>
                                        <img src={facilityIcons[item]} alt={item} className='w-5 h-5'/>
                                        <p className='text-xs'>{item}</p>
                                    </div>
                                ))}
                            </div>
                            {/* Gym price per month */}
                            <p className='text-xl font-medium text-gray-700'>${room.pricePerMonth} /Month</p>
                        </div>
                    </div>
                ))}
            </div>
            {/* Filter */}
            <div className='bg-white w-full lg:w-80 border border-gray-300 text-gray-600 max-lg:mb-8 lg:mt-16 lg:ml-8'>
                <div className={`flex items-center justify-between px-5 py-2.5 lg:border-b border-gray-300 ${openFilters && "border-b"}`}>
                    <p className='text-base font-medium text-gray-800'>FILTERS</p>
                    <div className='text-xs cursor-pointer'>
                        <span 
                            onClick={() => setOpenFilters(!openFilters)}
                            className='lg:hidden'
                        >
                            {openFilters ? 'HIDE' : 'SHOW'}
                        </span>
                        <span 
                            onClick={clearFilters}
                            className='hidden lg:block hover:text-primary'
                        >
                            CLEAR ALL
                        </span>
                    </div>
                </div>
                <div className={`${openFilters ? 'h-auto' : "h-0 lg:h-auto"} overflow-hidden transition-all duration-700`}>
                    <div className='px-5 pt-5'>
                        <p className='font-medium text-gray-800 pb-2'>Room Types</p>
                        {roomTypes.map((room, index) => (
                            <CheckBox 
                                key={index} 
                                label={room}
                                selected={selectedRoomTypes.includes(room)}
                                onChange={handleRoomTypeChange}
                            />
                        ))}
                    </div>
                    <div className='px-5 pt-5'>
                        <p className='font-medium text-gray-800 pb-2'>Price Range</p>
                        {priceRanges.map((price, index) => (
                            <CheckBox 
                                key={index} 
                                label={`$${price}`}
                                selected={selectedPriceRanges.includes(price)}
                                onChange={handlePriceRangeChange}
                            />
                        ))}
                    </div>
                    <div className='px-5 pt-5 pb-5'>
                        <p className='font-medium text-gray-800 pb-2'>Sort By</p>
                        {sortOptions.map((option, index) => (
                            <RadioButton 
                                key={index} 
                                label={option}
                                selected={sortOption === option}
                                onChange={handleSortChange}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllGyms;