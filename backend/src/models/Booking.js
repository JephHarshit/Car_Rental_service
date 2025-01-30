import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    validate: {
      validator: function(value) {
        return value >= new Date();
      },
      message: 'Start date cannot be in the past'
    }
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  totalDays: {
    type: Number,
    required: true,
    min: [1, 'Booking must be for at least one day']
  },
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  pickupLocation: {
    type: String,
    required: [true, 'Pickup location is required'],
    trim: true
  },
  dropoffLocation: {
    type: String,
    required: [true, 'Dropoff location is required'],
    trim: true
  },
  additionalDrivers: {
    type: Number,
    default: 0,
    min: [0, 'Additional drivers cannot be negative']
  },
  insurance: {
    type: Boolean,
    default: false
  },
  specialRequests: {
    type: String,
    trim: true
  },
  paymentId: {
    type: String,
    sparse: true
  }
}, {
  timestamps: true
});

// Calculate total days and amount before saving
bookingSchema.pre('save', function(next) {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  this.totalDays = Math.ceil(
    (this.endDate.getTime() - this.startDate.getTime()) / millisecondsPerDay
  );
  next();
});

// Update car availability after booking
bookingSchema.post('save', async function(doc) {
  if (doc.status === 'confirmed') {
    await mongoose.model('Car').findByIdAndUpdate(doc.car, { available: false });
  } else if (doc.status === 'completed' || doc.status === 'cancelled') {
    await mongoose.model('Car').findByIdAndUpdate(doc.car, { available: true });
  }
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;