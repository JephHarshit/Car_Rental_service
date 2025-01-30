import { useState, useEffect } from 'react';
import { cars as carsApi } from '../api/client';
import RangeFilter from '../components/filters/RangeFilter';
import SelectFilter from '../components/filters/SelectFilter';
import CarCard from '../components/cars/CarCard';

const COLORS = [
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
  { value: 'silver', label: 'Silver' },
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
  { value: 'gray', label: 'Gray' },
];

const FUEL_TYPES = [
  { value: 'Petrol', label: 'Petrol' },
  { value: 'Diesel', label: 'Diesel' },
  { value: 'Electric', label: 'Electric' },
  { value: 'Hybrid', label: 'Hybrid' },
];

const TRANSMISSION_TYPES = [
  { value: 'Manual', label: 'Manual' },
  { value: 'Automatic', label: 'Automatic' },
];

const ExploreCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    color: '',
    fuelType: '',
    transmission: '',
    available: true,
  });

  useEffect(() => {
    fetchCars();
  }, [filters]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await carsApi.getAll({
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        color: filters.color,
        fuelType: filters.fuelType,
        transmission: filters.transmission,
        available: filters.available,
      });
      setCars(response.data.data);
    } catch (err) {
      setError('Failed to fetch cars. Please try again later.');
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 1000],
      color: '',
      fuelType: '',
      transmission: '',
      available: true,
    });
  };

  const Filters = () => (
    <div className="space-y-6">
      {/* Price Range Filter */}
      <RangeFilter
        label="Price Range ($/day)"
        min={0}
        max={1000}
        step={10}
        value={filters.priceRange}
        onChange={(value) => handleFilterChange('priceRange', value)}
        prefix="$"
      />

      {/* Color Filter */}
      <SelectFilter
        label="Color"
        options={COLORS}
        value={filters.color}
        onChange={(value) => handleFilterChange('color', value)}
        placeholder="Select color"
      />

      {/* Fuel Type Filter */}
      <SelectFilter
        label="Fuel Type"
        options={FUEL_TYPES}
        value={filters.fuelType}
        onChange={(value) => handleFilterChange('fuelType', value)}
        placeholder="Select fuel type"
      />

      {/* Transmission Filter */}
      <SelectFilter
        label="Transmission"
        options={TRANSMISSION_TYPES}
        value={filters.transmission}
        onChange={(value) => handleFilterChange('transmission', value)}
        placeholder="Select transmission"
      />

      {/* Availability Filter */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="available"
          checked={filters.available}
          onChange={(e) => handleFilterChange('available', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="available" className="text-sm font-medium text-gray-700">
          Show only available cars
        </label>
      </div>

      {/* Reset Filters Button */}
      <button
        onClick={resetFilters}
        className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Reset Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Explore Cars</h1>
          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="lg:hidden px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Filters
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-x-8">
          {/* Mobile filter dialog */}
          {isMobileFiltersOpen && (
            <div className="fixed inset-0 flex z-40 lg:hidden">
              <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setIsMobileFiltersOpen(false)} />
              <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                <div className="px-4 flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-gray-500"
                    onClick={() => setIsMobileFiltersOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="mt-4 px-4">
                  <Filters />
                </div>
              </div>
            </div>
          )}

          {/* Desktop filters */}
          <div className="hidden lg:block">
            <Filters />
          </div>

          {/* Car grid */}
          <div className="mt-6 lg:mt-0 lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-gray-600">Loading cars...</div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            ) : cars.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">No cars found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your filters to find more cars.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {cars.map((car) => (
                  <CarCard key={car._id} car={car} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreCars;