import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cars as carsApi, bookings as bookingsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import Input from '../components/forms/Input';

const BookingDetails = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    pickupLocation: '',
    dropoffLocation: '',
    additionalDrivers: 0,
    insurance: false,
    specialRequests: '',
  });

  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    licenseNumber: user?.licenseNumber || '',
    age: user?.age || '',
  });

  useEffect(() => {
    fetchCarDetails();
  }, [carId]);

  const fetchCarDetails = async () => {
    try {
      setLoading(true);
      const response = await carsApi.getById(carId);
      setCar(response.data.data);
    } catch (err) {
      setError('Failed to fetch car details. Please try again later.');
      console.error('Error fetching car details:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalDays = () => {
    if (!bookingData.startDate || !bookingData.endDate) return 0;
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const totalDays = calculateTotalDays();
    let total = car.pricePerDay * totalDays;

    // Add insurance cost if selected
    if (bookingData.insurance) {
      total += totalDays * 10; // $10 per day for insurance
    }

    // Add additional drivers cost
    if (bookingData.additionalDrivers > 0) {
      total += bookingData.additionalDrivers * totalDays * 5; // $5 per additional driver per day
    }

    return total;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!bookingData.startDate || !bookingData.endDate) {
      setError('Please select booking dates');
      return false;
    }

    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const now = new Date();

    if (start < now) {
      setError('Start date cannot be in the past');
      return false;
    }

    if (end <= start) {
      setError('End date must be after start date');
      return false;
    }

    if (!bookingData.pickupLocation || !bookingData.dropoffLocation) {
      setError('Please provide pickup and drop-off locations');
      return false;
    }

    if (!customerInfo.licenseNumber) {
      setError('Please provide your driver\'s license number');
      return false;
    }

    if (!customerInfo.age || customerInfo.age < 18) {
      setError('You must be at least 18 years old to book a car');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setError(null);

      const totalAmount = calculateTotal();
      const booking = await bookingsApi.create({
        carId,
        ...bookingData,
        totalAmount,
      });

      navigate(`/payment/${booking.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Loading booking details...</div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error || 'Car not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          {/* Booking Form */}
          <div className="md:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Booking Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="date"
                    name="startDate"
                    value={bookingData.startDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                  <Input
                    label="End Date"
                    type="date"
                    name="endDate"
                    value={bookingData.endDate}
                    onChange={handleInputChange}
                    min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Pickup Location"
                    name="pickupLocation"
                    value={bookingData.pickupLocation}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Drop-off Location"
                    name="dropoffLocation"
                    value={bookingData.dropoffLocation}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Additional Services */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Additional Drivers
                    </label>
                    <input
                      type="number"
                      name="additionalDrivers"
                      value={bookingData.additionalDrivers}
                      onChange={handleInputChange}
                      min="0"
                      max="3"
                      className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="insurance"
                      name="insurance"
                      checked={bookingData.insurance}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="insurance" className="ml-2 text-sm text-gray-700">
                      Add Insurance Coverage ($10/day)
                    </label>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Customer Information
                  </h3>
                  <Input
                    label="Driver's License Number"
                    name="licenseNumber"
                    value={customerInfo.licenseNumber}
                    onChange={handleCustomerInfoChange}
                    required
                  />
                  <Input
                    label="Age"
                    type="number"
                    name="age"
                    value={customerInfo.age}
                    onChange={handleCustomerInfoChange}
                    min="18"
                    required
                  />
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Special Requests
                  </label>
                  <textarea
                    name="specialRequests"
                    value={bookingData.specialRequests}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className={`
                    w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    ${submitting ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {submitting ? 'Processing...' : 'Proceed to Payment'}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-6 md:mt-0">
            <div className="bg-white shadow rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Order Summary
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Car</span>
                  <span className="font-medium">
                    {car.brand} {car.model}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{calculateTotalDays()} days</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Base Price</span>
                  <span className="font-medium">${car.pricePerDay}/day</span>
                </div>

                {bookingData.insurance && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Insurance</span>
                    <span className="font-medium">
                      ${10 * calculateTotalDays()}
                    </span>
                  </div>
                )}

                {bookingData.additionalDrivers > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Additional Drivers</span>
                    <span className="font-medium">
                      ${5 * bookingData.additionalDrivers * calculateTotalDays()}
                    </span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-medium">Total</span>
                    <span className="text-lg font-bold text-blue-600">
                      ${calculateTotal()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;