const { Gym, User } = require('./src/models');
const bcrypt = require('bcryptjs');

const realGyms = [
  {
    name: 'Fitness First Nepal',
    description: 'Premium fitness center with state-of-the-art equipment, professional trainers, and diverse workout programs. Perfect for both beginners and advanced fitness enthusiasts.',
    address: 'Durbar Marg, Kathmandu',
    city: 'Kathmandu',
    state: 'Bagmati',
    zipCode: '44600',
    phone: '+977-1-4444444',
    email: 'info@fitnessfirstnepal.com',
    website: 'https://fitnessfirstnepal.com',
    openingHours: '6:00 AM - 10:00 PM',
    facilities: ['Parking', 'Shower', 'Locker', 'Wifi', 'AC', 'Personal Trainer', 'Group Classes'],
    monthlyPrice: 4500,
    annualPrice: 45000,
    rating: 4.8,
    totalReviews: 156,
    isActive: true,
    isVerified: true,
    isBoosted: true,
    images: [
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=compress&cs=tinysrgb&w=800',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=compress&cs=tinysrgb&w=800'
    ]
  },
  {
    name: 'Power House Gym & Fitness',
    description: 'Modern fitness facility with comprehensive equipment, group classes, and personal training services. Great community atmosphere for all fitness levels.',
    address: 'Lakeside, Pokhara',
    city: 'Pokhara',
    state: 'Gandaki',
    zipCode: '33700',
    phone: '+977-61-5555555',
    email: 'contact@powerhousepokhara.com',
    website: 'https://powerhousepokhara.com',
    openingHours: '5:00 AM - 11:00 PM',
    facilities: ['Parking', 'Shower', '24/7 Access', 'Group Classes', 'Yoga', 'Cardio Zone'],
    monthlyPrice: 3500,
    annualPrice: 35000,
    rating: 4.6,
    totalReviews: 89,
    isActive: true,
    isVerified: true,
    isBoosted: false,
    images: [
      'https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=compress&cs=tinysrgb&w=800',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=compress&cs=tinysrgb&w=800'
    ]
  },
  {
    name: 'Iron Paradise Strength & Conditioning',
    description: 'Elite strength and conditioning facility specializing in powerlifting, Olympic lifting, and functional fitness. Professional coaching for serious athletes.',
    address: 'New Road, Kathmandu',
    city: 'Kathmandu',
    state: 'Bagmati',
    zipCode: '44600',
    phone: '+977-1-6666666',
    email: 'info@ironparadise.com',
    website: 'https://ironparadise.com',
    openingHours: '5:00 AM - 12:00 AM',
    facilities: ['Parking', 'Shower', 'Sauna', 'Pool', 'Personal Trainer', 'CrossFit', 'Olympic Lifting'],
    monthlyPrice: 5500,
    annualPrice: 55000,
    rating: 4.9,
    totalReviews: 234,
    isActive: true,
    isVerified: true,
    isBoosted: true,
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=compress&cs=tinysrgb&w=800',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=compress&cs=tinysrgb&w=800'
    ]
  },
  {
    name: 'Fit Nation Health Club',
    description: 'Comprehensive health club offering fitness, yoga, and wellness programs. Modern equipment with certified trainers and nutrition guidance.',
    address: 'Baneshwor, Kathmandu',
    city: 'Kathmandu',
    state: 'Bagmati',
    zipCode: '44600',
    phone: '+977-1-7777777',
    email: 'hello@fitnationnepal.com',
    website: 'https://fitnationnepal.com',
    openingHours: '6:00 AM - 9:00 PM',
    facilities: ['Parking', 'Shower', 'Yoga Studio', 'Cafe', 'Cardio Equipment', 'Free Weights'],
    monthlyPrice: 3800,
    annualPrice: 38000,
    rating: 4.4,
    totalReviews: 98,
    isActive: true,
    isVerified: true,
    isBoosted: false,
    images: [
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=compress&cs=tinysrgb&w=800',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=compress&cs=tinysrgb&w=800'
    ]
  },
  {
    name: 'Muscle Factory Bodybuilding Gym',
    description: 'Specialized bodybuilding and strength training facility. Expert coaching for muscle building, competition preparation, and powerlifting.',
    address: 'Chabahil, Kathmandu',
    city: 'Kathmandu',
    state: 'Bagmati',
    zipCode: '44600',
    phone: '+977-1-8888888',
    email: 'info@musclefactorynepal.com',
    website: 'https://musclefactorynepal.com',
    openingHours: '5:00 AM - 11:00 PM',
    facilities: ['Parking', 'Shower', 'CrossFit', 'Personal Training', 'Supplement Shop', 'Competition Prep'],
    monthlyPrice: 4200,
    annualPrice: 42000,
    rating: 4.7,
    totalReviews: 145,
    isActive: true,
    isVerified: false,
    isBoosted: true,
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=compress&cs=tinysrgb&w=800',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=compress&cs=tinysrgb&w=800'
    ]
  },
  {
    name: 'Zen Yoga & Wellness Center',
    description: 'Holistic wellness center combining traditional yoga, meditation, and modern fitness. Perfect for mind-body balance and stress relief.',
    address: 'Mandala Street, Pokhara',
    city: 'Pokhara',
    state: 'Gandaki',
    zipCode: '33700',
    phone: '+977-61-9999999',
    email: 'peace@zenyogapokhara.com',
    website: 'https://zenyogapokhara.com',
    openingHours: '6:00 AM - 8:00 PM',
    facilities: ['Yoga Studio', 'Meditation Room', 'Steam Room', 'Cafe', 'Wellness Programs', 'Ayurvedic Consultation'],
    monthlyPrice: 2800,
    annualPrice: 28000,
    rating: 4.5,
    totalReviews: 78,
    isActive: true,
    isVerified: true,
    isBoosted: false,
    images: [
      'https://images.unsplash.com/photo-1545389336-cf090694435e?auto=compress&cs=tinysrgb&w=800',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=compress&cs=tinysrgb&w=800'
    ]
  },
  {
    name: 'CrossFit Kathmandu',
    description: 'Official CrossFit affiliate offering high-intensity functional fitness programs. Certified coaches and community-driven workouts.',
    address: 'Thamel, Kathmandu',
    city: 'Kathmandu',
    state: 'Bagmati',
    zipCode: '44600',
    phone: '+977-1-1111111',
    email: 'info@crossfitkathmandu.com',
    website: 'https://crossfitkathmandu.com',
    openingHours: '5:00 AM - 10:00 PM',
    facilities: ['CrossFit Equipment', 'Olympic Lifting', 'Personal Training', 'Nutrition Coaching', 'Competition Training'],
    monthlyPrice: 4800,
    annualPrice: 48000,
    rating: 4.8,
    totalReviews: 167,
    isActive: true,
    isVerified: true,
    isBoosted: true,
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=compress&cs=tinysrgb&w=800',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=compress&cs=tinysrgb&w=800'
    ]
  },
  {
    name: 'Elite Fitness & Sports Club',
    description: 'Premium sports and fitness club with comprehensive facilities including swimming pool, tennis courts, and luxury amenities.',
    address: 'Lalitpur, Kathmandu Valley',
    city: 'Lalitpur',
    state: 'Bagmati',
    zipCode: '44700',
    phone: '+977-1-2222222',
    email: 'membership@elitefitnessnepal.com',
    website: 'https://elitefitnessnepal.com',
    openingHours: '6:00 AM - 11:00 PM',
    facilities: ['Parking', 'Shower', 'Sauna', 'Pool', 'Tennis Court', 'Squash Court', 'Personal Trainer'],
    monthlyPrice: 5200,
    annualPrice: 52000,
    rating: 4.9,
    totalReviews: 189,
    isActive: true,
    isVerified: true,
    isBoosted: true,
    images: [
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=compress&cs=tinysrgb&w=800',
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=compress&cs=tinysrgb&w=800'
    ]
  }
];

async function seedGyms() {
  try {
    console.log('Starting gym seeding...');
    
    // Find an existing gym owner
    let gymOwner = await User.findOne({ where: { role: 'gym_owner' } });
    
    if (!gymOwner) {
      console.log('No gym owner found, creating one...');
      try {
        const hashedPassword = await bcrypt.hash('password123', 10);
        gymOwner = await User.create({
          username: 'gymowner',
          email: 'gymowner@example.com',
          password: hashedPassword,
          firstName: 'Gym',
          lastName: 'Owner',
          phone: '+977-1-1234567',
          role: 'gym_owner'
        });
        console.log('Created gym owner user');
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          // User already exists, find it
          gymOwner = await User.findOne({ where: { role: 'gym_owner' } });
          console.log('Gym owner user already exists, using existing user');
        } else {
          throw error;
        }
      }
    } else {
      console.log('Using existing gym owner:', gymOwner.username);
    }

    // Clear existing gyms
    await Gym.destroy({ where: {} });
    console.log('Cleared existing gyms');

    // Create gyms
    for (const gymData of realGyms) {
      await Gym.create({
        ...gymData,
        ownerId: gymOwner.id
      });
    }

    console.log(`Successfully seeded ${realGyms.length} gyms!`);
    console.log('Gym owner credentials:');
    console.log('Email: gymowner@example.com');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('Error seeding gyms:', error);
  } finally {
    process.exit(0);
  }
}

seedGyms(); 