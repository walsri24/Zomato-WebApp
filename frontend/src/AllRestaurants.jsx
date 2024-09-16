import React, { useState, useEffect } from 'react';
import './AllRestaurants.css'; // Add your styles here

const AllRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 12;

  useEffect(() => {
    console.log('Fetching restaurants for page:', page);
    fetchRestaurants();
  }, [page]);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/restaurants?page=${page}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      setRestaurants(data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handlePrevPage = () => setPage((prevPage) => Math.max(1, prevPage - 1));
  const handleNextPage = () => setPage((prevPage) => prevPage + 1);

  return (
    <div>
      <h2>All Restaurants</h2>
      <div className="restaurant-grid">
        {restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <div key={restaurant['Restaurant ID']} className="restaurant-card">
              <img src={restaurant.featured_image} alt={restaurant['Restaurant Name']} />
              <h3>{restaurant['Restaurant Name']}</h3>
              <p>{restaurant['Cuisines']}</p>
              <p>{restaurant['Address']}</p>
              <p>{renderStars(restaurant['Aggregate rating'])} ({restaurant['Aggregate rating']})</p>
            </div>
          ))
        ) : (
          <p>Database Not Connected.</p>
        )}
      </div>
      <div className="pagination">
        <button onClick={handlePrevPage}>Prev</button>
        {page}
        <button onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
};

const renderStars = (rating) => {
  const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  return <span>{stars}</span>;
};

export default AllRestaurants;
