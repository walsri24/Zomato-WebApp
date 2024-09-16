import React, { useState } from 'react';
import './ImageSearch.css';

const ImageSearch = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('image', file);

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://127.0.0.1:5000/restaurants/image-upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError('Error uploading image.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Search Restaurants by Image</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
      />
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {searchResults && (
        <div className="results">
          <h3>Results:</h3>
          {searchResults.map((restaurant, index) => (
            <div key={index}>
              <h3>{restaurant['Restaurant Name']}</h3>
              <p>{restaurant['Cuisines']}</p>
              <p>{restaurant['Address']}</p>
              <img src={restaurant.featured_image} alt={restaurant['Restaurant Name']} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSearch;
