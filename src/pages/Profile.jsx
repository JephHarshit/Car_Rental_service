import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookings as bookingsApi } from '../api/client';

const Profile = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingsApi.getMyBookings();
      setBookings(response.data.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Success Message */}
      {location.state?.paymentSuccess && (
        <div className="mb-6 bg-green-50 text-green-700 p-4 rounded">
          Payment successful! Your booking is confirmed.
        </div>
      )}

      {/* User Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-600">Name</label>
            <p className="font-medium">{user.name}</p>
          </div>
          <div>
            <label className="text-gray-600">Email</label>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <label className="text-gray-600">Phone</label>
            <p className="font-medium">{user.phone}</p>
          </div>
          <div>
            <label className="text-gray-600">License Number</label>
            <p className="font-medium">{user.licenseNumber || 'Not provided'}</p>
          </div>
        </div>
      </div>

      {/* Rental History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Rental History</h2>
        {loading ? (
          <p>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500">No rentals found.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="border rounded p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">
                      {booking.car?.brand} {booking.car?.model}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.startDate).toLocaleDateString()} -{' '}
                      {new Date(booking.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`
                      px-2 py-1 rounded text-sm font-medium
                      ${booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'}
                    `}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    <p className="mt-1 font-medium">${booking.totalAmount}</p>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Pickup: {booking.pickupLocation}</p>
                  <p>Drop-off: {booking.dropoffLocation}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;