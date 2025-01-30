import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0, 'Payment amount cannot be negative']
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['UPI', 'CREDIT_CARD', 'DEBIT_CARD'],
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  paymentDetails: {
    cardLastFour: String,
    upiId: String,
    bankName: String
  },
  refundDetails: {
    refundId: String,
    refundDate: Date,
    refundAmount: Number,
    reason: String
  },
  billing: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  }
}, {
  timestamps: true
});

// Generate a unique transaction ID before saving
paymentSchema.pre('save', function(next) {
  if (!this.transactionId) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.transactionId = `TXN${timestamp}${random}`;
  }
  next();
});

// Update booking payment status after payment completion
paymentSchema.post('save', async function(doc) {
  if (doc.status === 'completed') {
    await mongoose.model('Booking').findByIdAndUpdate(doc.booking, {
      paymentStatus: 'completed',
      paymentId: doc.transactionId
    });
  } else if (doc.status === 'refunded') {
    await mongoose.model('Booking').findByIdAndUpdate(doc.booking, {
      paymentStatus: 'refunded'
    });
  }
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;