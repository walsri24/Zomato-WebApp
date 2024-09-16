import React, { useState } from 'react';

const SearchNearby = () => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState(5);
  const [restaurants, setRestaurants] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/restaurants/near?lat=${latitude}&lng=${longitude}&radius=${radius}`);
      const data = await response.json();
      setRestaurants(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Search Nearby Restaurants</h2>
      <input
        type="number"
        placeholder="Latitude"
        value={latitude}
        onChange={(e) => setLatitude(e.target.value)}
      />
      <input
        type="number"
        placeholder="Longitude"
        value={longitude}
        onChange={(e) => setLongitude(e.target.value)}
      />
      <input
        type="range"
        min="1"
        max="50"
        value={radius}
        onChange={(e) => setRadius(e.target.value)}
      />
      <span>{radius} km</span>
      <button onClick={handleSearch}>Search Nearby</button>
      <div>
        {restaurants.map((restaurant) => (
          <div key={restaurant['Restaurant ID']}>
            <h3>{restaurant['Restaurant Name']}</h3>
            <p>{restaurant['Cuisines']}</p>
            <p>{restaurant['Address']}</p>
            <p>{renderStars(restaurant['Aggregate rating'])} ({restaurant['Aggregate rating']})</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const renderStars = (rating) => {
  const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  return <span>{stars}</span>;
};

export default SearchNearby;
