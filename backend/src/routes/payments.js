import { Router } from 'express';
import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

// Initialize payment for a booking (Protected)
router.post('/initialize', protect, async (req, res) => {
  try {
    const { bookingId, paymentMethod, billingDetails } = req.body;

    // Validate request
    if (!bookingId || !paymentMethod || !billingDetails) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required payment details'
      });
    }

    // Check if booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to make payment for this booking'
      });
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ booking: bookingId });
    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: 'Payment already exists for this booking'
      });
    }

    // Create payment record
    const payment = await Payment.create({
      booking: bookingId,
      user: req.user.id,
      amount: booking.totalAmount,
      paymentMethod,
      status: 'pending',
      billing: {
        name: billingDetails.name,
        email: billingDetails.email,
        phone: billingDetails.phone,
        address: billingDetails.address
      }
    });

    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error initializing payment',
      error: error.message
    });
  }
});

// Process payment (Protected)
router.post('/process/:id', protect, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to process this payment'
      });
    }

    // Simulate payment processing
    const { paymentDetails } = req.body;

    // Validate payment details based on method
    if (payment.paymentMethod === 'CREDIT_CARD' || payment.paymentMethod === 'DEBIT_CARD') {
      if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all card details'
        });
      }
    } else if (payment.paymentMethod === 'UPI') {
      if (!paymentDetails.upiId) {
        return res.status(400).json({
          success: false,
          message: 'Please provide UPI ID'
        });
      }
    }

    // Simulate successful payment
    payment.status = 'completed';
    payment.paymentDetails = {
      cardLastFour: paymentDetails.cardNumber ? paymentDetails.cardNumber.slice(-4) : null,
      upiId: paymentDetails.upiId || null,
      bankName: paymentDetails.bankName || null
    };

    await payment.save();

    // Update booking status
    await Booking.findByIdAndUpdate(payment.booking, {
      status: 'confirmed',
      paymentStatus: 'completed'
    });

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing payment',
      error: error.message
    });
  }
});

// Get payment details (Protected)
router.get('/:id', protect, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('booking')
      .populate('user', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this payment'
      });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment details',
      error: error.message
    });
  }
});

// Get user's payment history (Protected)
router.get('/', protect, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate({
        path: 'booking',
        populate: {
          path: 'car',
          select: 'name brand model'
        }
      })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment history',
      error: error.message
    });
  }
});

export default router;