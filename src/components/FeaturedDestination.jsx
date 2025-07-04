import React from 'react';
import { roomsDummyData } from '../assets/assets';
import GymCard from './GymCard';
import Title from './Title';
import { useNavigate } from 'react-router-dom';

const FeaturedDestination = () => {
  const navigate = useNavigate();

  const handleViewAllClick = () => {
    navigate('/rooms');
    window.scrollTo(0, 0);
  };

  return (
    <section className='flex flex-col items-center px-6 md:px-6 lg:px-24 bg-slate-50 py-20'>
      <Title 
        title='Featured Training Destination' 
        subTitle='Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable training experiences.'
      />
      
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 w-full'>
        {roomsDummyData.slice(0, 4).map((room) => (
          <GymCard key={room._id} room={room} />
        ))}
      </div>
      
      <button
        onClick={handleViewAllClick}
        className='my-16 px-6 py-3 text-base font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer shadow-sm hover:shadow-md'
      >
        View All Training Destinations
      </button>
    </section>
  );
};

export default FeaturedDestination;