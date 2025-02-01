import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cars as carsApi } from '../api/client';

const Home = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        const response = await carsApi.getAll({ limit: 4 });
        setFeaturedCars(response.data.data);
      } catch (error) {
        console.error('Error fetching featured cars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCars();
  }, []);

  const benefits = [
    {
      title: 'Wide Selection',
      description: 'Choose from our extensive fleet of vehicles for any occasion',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      title: 'Best Prices',
      description: 'Competitive rates and transparent pricing with no hidden fees',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: '24/7 Support',
      description: 'Round-the-clock customer support for peace of mind',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white h-dvh">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-50"
            src="https://images.unsplash.com/photo-1493238792000-8113da705763"
            alt="Car rental hero"
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Wide Range of Cars
          </h1>
          <p className="mt-6 text-xl mb-[50px] text-gray-300 max-w-3xl">
          From Luxury, Business to Budget-Friendly Options.
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Select from Variety
          </h1>
          <p className="mt-6 text-xl mb-[50px] text-gray-300 max-w-3xl">
          Choose from Over 100+ Models - SUVs, Sedans, Hatchbacks, and More.
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Sized to Suit
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl">
          From Compact to Spacious - Drive Your Perfect Match.
          </p>
          <div className="mt-10">
            <Link
              to="/explore"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Explore Cars
            </Link>
          </div>
        </div>
      </div>

      {/* explore section */}
      <div className="bg-slate-200 w-screen flex flex-col sm:flex-row gap-5 items-center justify-between p-4">
  <div className="relative rounded-lg border border-gray-300">
    <img className="object-cover w-full h-full lg:h-[300px]" src="https://wallpapers.com/images/hd/gray-black-mahindra-thar-2021-p7o1s7iv5ucfgv8c.jpg" alt="" />
  </div>
  <div className="flex flex-col space-y-4 items-center "> {/* Added items-center */}
    <div className="text-slate-900 font-bold text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-center "> {/* Added text-center */}What</div>
    <div className="text-blue-500 font-bold font-serif text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-center"> {/* Added text-center */}Drift</div>
    <div className="text-slate-900 font-bold text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-center"> {/* Added text-center */}would you choose?</div>
    <div className="text-slate-600 font-bold text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-center"> {/* Added text-center */}flow through air....!</div>
  </div>
  <Link to="/explore" className="inline-flex items-center px-6 py-3 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 mr-[100px] mt-4 sm:mt-0">
    <span className="text-base sm:text-lg md:text-xl lg:text-3xl">Explore</span>
  </Link>
</div>

      {/* Featured Cars Section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Featured Vehicles
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Discover our most popular rental choices
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              <div className="col-span-4 text-center py-12">Loading...</div>
            ) : (
              featuredCars.map((car) => (
                <div
                  key={car._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <img
                    className="w-full h-48 object-cover"
                    src={car.images[0]}
                    alt={`${car.brand} ${car.model}`}
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {car.brand} {car.model}
                    </h3>
                    <p className="mt-2 text-gray-600">{car.year}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-xl font-bold text-blue-600">
                        ${car.pricePerDay}/day
                      </span>
                      <Link
                        to={`/cars/${car._id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose Us
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Experience the best car rental service with our premium features
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="text-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mx-auto">
                    {benefit.icon}
                  </div>
                  <h3 className="mt-6 text-lg font-medium text-gray-900">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-blue-200">
              Book your car today and hit the road.
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/explore"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;