const testData = {
  users: {
    regular: {
      id: 'user-1',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
      role: 'user',
      isActive: true
    },
    gymOwner: {
      id: 'owner-1',
      email: 'owner@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      password: 'password123',
      role: 'gym_owner',
      isActive: true
    },
    admin: {
      id: 'admin-1',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      password: 'password123',
      role: 'admin',
      isActive: true
    }
  },
  
  gyms: {
    basic: {
      id: 'gym-1',
      name: 'Test Gym',
      description: 'A test gym',
      address: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      phone: '1234567890',
      monthlyPrice: 2000,
      annualPrice: 20000,
      facilities: ['Parking', 'Shower'],
      images: ['/uploads/test-image.jpg'],
      ownerId: 'owner-1'
    },
    premium: {
      id: 'gym-2',
      name: 'Premium Gym',
      description: 'A premium gym',
      address: '456 Premium St',
      city: 'Premium City',
      state: 'Premium State',
      phone: '0987654321',
      monthlyPrice: 5000,
      annualPrice: 50000,
      facilities: ['Parking', 'Shower', 'Pool', 'Sauna'],
      images: ['/uploads/premium-image.jpg'],
      ownerId: 'owner-1'
    }
  },
  
  bookings: {
    pending: {
      id: 'booking-1',
      userId: 'user-1',
      gymId: 'gym-1',
      bookingDate: '2024-01-15',
      bookingTime: '10:00',
      status: 'pending',
      totalAmount: 2000,
      paymentMethod: 'cash',
      notes: 'Test booking'
    },
    confirmed: {
      id: 'booking-2',
      userId: 'user-1',
      gymId: 'gym-1',
      bookingDate: '2024-01-16',
      bookingTime: '14:00',
      status: 'confirmed',
      totalAmount: 2000,
      paymentMethod: 'card',
      notes: 'Confirmed booking'
    }
  },
  
  memberships: {
    active: {
      id: 'membership-1',
      userId: 'user-1',
      gymId: 'gym-1',
      name: 'Monthly Plan',
      price: 2000,
      duration: 1,
      durationType: 'months',
      isActive: true
    },
    inactive: {
      id: 'membership-2',
      userId: 'user-1',
      gymId: 'gym-2',
      name: 'Annual Plan',
      price: 20000,
      duration: 12,
      durationType: 'months',
      isActive: false
    }
  }
};

module.exports = testData; 