import React, { useState } from 'react';

const RestaurantById = () => {
  const [restaurantId, setRestaurantId] = useState('');
  const [singleRestaurant, setSingleRestaurant] = useState(null);

  const fetchRestaurantById = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/restaurant/${restaurantId}`);
      const data = await response.json();
      setSingleRestaurant(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Get Restaurant by ID</h2>
      <input
        type="text"
        placeholder="Restaurant ID"
        value={restaurantId}
        onChange={(e) => setRestaurantId(e.target.value)}
      />
      <button onClick={fetchRestaurantById}>Get Restaurant</button>
      {singleRestaurant && (
        <div>
          <h3>{singleRestaurant['Restaurant Name']}</h3>
          <p>{singleRestaurant['Cuisines']}</p>
          <p>{singleRestaurant['Address']}</p>
          <p>{renderStars(singleRestaurant['Aggregate rating'])} ({singleRestaurant['Aggregate rating']})</p>
          <img src={singleRestaurant.featured_image} alt={singleRestaurant['Restaurant Name']} />
        </div>
      )}
    </div>
  );
};

const renderStars = (rating) => {
  const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  return <span>{stars}</span>;
};

export default RestaurantById;
