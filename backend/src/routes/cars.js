import { Router } from 'express';
import Car from '../models/Car.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

// Get all cars with filters
router.get('/', async (req, res) => {
  try {
    const {
      color,
      fuelType,
      minPrice,
      maxPrice,
      available,
      transmission,
      brand,
      seats
    } = req.query;

    // Build query
    const query = {};

    if (color) query.color = { $regex: color, $options: 'i' };
    if (fuelType) query.fuelType = fuelType;
    if (transmission) query.transmission = transmission;
    if (brand) query.brand = { $regex: brand, $options: 'i' };
    if (seats) query.seats = seats;
    if (available !== undefined) query.available = available === 'true';
    
    // Price range
    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }

    const cars = await Car.find(query)
      .select('-ratings')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: cars.length,
      data: cars
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cars',
      error: error.message
    });
  }
});

// Get single car
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
      .populate({
        path: 'ratings.user',
        select: 'name'
      });

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching car',
      error: error.message
    });
  }
});

// Create car (Protected)
router.post('/', protect, async (req, res) => {
  try {
    const car = await Car.create(req.body);

    res.status(201).json({
      success: true,
      data: car
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating car',
      error: error.message
    });
  }
});

// Update car (Protected)
router.put('/:id', protect, async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating car',
      error: error.message
    });
  }
});

// Delete car (Protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    await car.remove();

    res.status(200).json({
      success: true,
      message: 'Car deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting car',
      error: error.message
    });
  }
});

// Add rating (Protected)
router.post('/:id/ratings', protect, async (req, res) => {
  try {
    const { rating, review } = req.body;
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    // Check if user already rated
    const existingRating = car.ratings.find(
      r => r.user.toString() === req.user.id
    );

    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: 'You have already rated this car'
      });
    }

    // Add rating
    car.ratings.push({
      user: req.user.id,
      rating,
      review
    });

    await car.save();

    res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding rating',
      error: error.message
    });
  }
});

export default router;