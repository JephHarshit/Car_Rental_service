import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookings as bookingsApi, payments as paymentsApi } from '../api/client';
import Input from '../components/forms/Input';

const PAYMENT_METHODS = [
  { id: 'CREDIT_CARD', label: 'Credit Card' },
  { id: 'DEBIT_CARD', label: 'Debit Card' },
  { id: 'UPI', label: 'UPI' }
];

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    upiId: ''
  });

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await bookingsApi.getById(bookingId);
        setBooking(response.data.data);
      } catch (err) {
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMethod) {
      setError('Please select a payment method');
      return;
    }

    try {
      await paymentsApi.process(bookingId, {
        method: selectedMethod,
        details: paymentDetails
      });
      navigate('/profile', { 
        replace: true,
        state: { paymentSuccess: true }
      });
    } catch (err) {
      setError('Payment failed. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!booking) return <div>Booking not found</div>;

  return (
    <div className="max-w-lg mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Payment</h2>
        
        {/* Order Summary */}
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <h3 className="font-medium mb-2">Order Summary</h3>
          <div className="flex justify-between mb-2">
            <span>Car</span>
            <span>{booking.car?.brand} {booking.car?.model}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${booking.totalAmount}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Payment Method Selection */}
          <div>
            <h3 className="font-medium mb-2">Payment Method</h3>
            <div className="space-y-2">
              {PAYMENT_METHODS.map(method => (
                <label key={method.id} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedMethod === method.id}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="text-blue-600"
                  />
                  <span>{method.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Payment Details */}
          {selectedMethod && (
            <div>
              {selectedMethod.includes('CARD') ? (
                <Input
                  label="Card Number"
                  value={paymentDetails.cardNumber}
                  onChange={(e) => setPaymentDetails({ cardNumber: e.target.value })}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              ) : (
                <Input
                  label="UPI ID"
                  value={paymentDetails.upiId}
                  onChange={(e) => setPaymentDetails({ upiId: e.target.value })}
                  placeholder="username@upi"
                  required
                />
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Pay ${booking.totalAmount}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
