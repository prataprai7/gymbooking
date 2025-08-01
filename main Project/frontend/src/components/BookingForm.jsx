import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Star,
  Users,
  X,
  AlertCircle
} from 'lucide-react';

const BookingForm = ({ gym, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bookingDate: '',
    startTime: '',
    endTime: '',
    notes: '',
    totalAmount: (() => {
      try {
        return gym?.memberships?.[0]?.price || gym?.monthlyPrice || 2000;
      } catch (error) {
        console.error('Error calculating total amount:', error);
        return 2000;
      }
    })(),
    paymentMethod: 'cash'
  });

  const [selectedMembership, setSelectedMembership] = useState(
    gym?.memberships?.[0] || null
  );

  useEffect(() => {
    if (selectedMembership) {
      setFormData(prev => ({
        ...prev,
        totalAmount: selectedMembership.price
      }));
    } else if (gym?.monthlyPrice) {
      setFormData(prev => ({
        ...prev,
        totalAmount: gym.monthlyPrice
      }));
    }
  }, [selectedMembership, gym?.monthlyPrice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.bookingDate || !formData.startTime || !formData.endTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (new Date(formData.bookingDate) < new Date().setHours(0, 0, 0, 0)) {
      toast.error('Booking date cannot be in the past');
      return;
    }

    if (formData.startTime >= formData.endTime) {
      toast.error('End time must be after start time');
      return;
    }

    try {
      setLoading(true);
      
      const bookingData = {
        gymId: gym.id,
        membershipId: selectedMembership?.id,
        ...formData
      };

      const response = await axios.post('/api/bookings', bookingData);
      
      toast.success('Booking created successfully!');
      onSuccess?.(response.data.booking);
      onClose();
      
      // Navigate to bookings page after a short delay
      setTimeout(() => {
        navigate('/bookings');
      }, 1500);
      
    } catch (error) {
      console.error('Error creating booking:', error);
      let message = 'Failed to create booking';
      
      if (error.response?.data?.error) {
        message = error.response.data.error;
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Book Gym Session</h2>
            <p className="text-gray-600 mt-1">Complete your booking details</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Gym Info */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
              {gym?.images?.[0] ? (
                <img
                  src={gym.images[0].startsWith('http') ? gym.images[0] : `http://localhost:8000${gym.images[0]}`}
                  alt={gym.name}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    console.error('Image failed to load:', e.target.src);
                    e.target.src = 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=400';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-gray-500" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{gym?.name}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{gym?.city}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{gym?.rating || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{gym?.totalReviews || 0} reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Membership Selection */}
          {gym?.memberships && gym.memberships.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Membership Plan
              </label>
              <div className="grid gap-3">
                {gym.memberships.map((membership) => (
                  <label
                    key={membership.id}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedMembership?.id === membership.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="membership"
                      value={membership.id}
                      checked={selectedMembership?.id === membership.id}
                      onChange={() => setSelectedMembership(membership)}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{membership.name}</h4>
                        <span className="text-lg font-semibold text-primary-600">
                          NPR {membership.price}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {membership.duration} {membership.durationType}
                        {membership.features && ` • ${membership.features}`}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Booking Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booking Date *
              </label>
              <input
                type="date"
                name="bookingDate"
                value={formData.bookingDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time *
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time *
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="online">Online</option>
                <option value="wallet">Wallet</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Any special requirements or notes..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Total Amount */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-gray-900">Total Amount:</span>
              <span className="text-2xl font-bold text-primary-600">
                NPR {formData.totalAmount}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm; 