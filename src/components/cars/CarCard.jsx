import { Link } from 'react-router-dom';

const CarCard = ({ car }) => {
  const {
    _id,
    name,
    brand,
    model,
    year,
    color,
    fuelType,
    transmission,
    pricePerDay,
    images,
    available,
    seats,
    location,
    averageRating
  } = car;

  const features = [
    { icon: '🛢️', text: fuelType },
    { icon: '⚙️', text: transmission },
    { icon: '👥', text: `${seats} seats` },
    { icon: '📍', text: location }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        {/* Car Image */}
        <img
          src={images[0]}
          alt={`${brand} ${model}`}
          className="w-full h-48 object-cover"
        />
        
        {/* Availability Badge */}
        <div className={`
          absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium
          ${available 
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
          }
        `}>
          {available ? 'Available' : 'Booked'}
        </div>

        {/* Rating Badge */}
        {averageRating > 0 && (
          <div className="absolute top-4 left-4 bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-800 flex items-center">
            <span className="text-yellow-400 mr-1">⭐</span>
            {averageRating.toFixed(1)}
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Car Info */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900">
            {brand} {model}
          </h3>
          <p className="text-sm text-gray-500">
            {year} • {color}
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center text-sm text-gray-600">
              <span className="mr-1">{feature.icon}</span>
              {feature.text}
            </div>
          ))}
        </div>

        {/* Price and Action */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-blue-600">
              ${pricePerDay}
            </span>
            <span className="text-gray-500 text-sm">/day</span>
          </div>

          {available ? (
            <Link
              to={`/booking/${_id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Book Now
            </Link>
          ) : (
            <Link
              to={`/cars/${_id}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarCard;