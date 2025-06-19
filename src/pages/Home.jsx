import React from 'react'
import Hero from '../components/Hero'
import FeaturedDestination from '../components/FeaturedDestination'
import Tesimonial from '../components/Testimonial'
import ExclusiveOffers from '../components/ExclusiveOffers'
import NewsLetter from '../components/NewsLetter'

const Home = () => {
    return(
        <>
            <Hero />
            <FeaturedDestination/>
            <ExclusiveOffers/>
            <Tesimonial/>
            <NewsLetter/>

        </>
    )
}

export default Home