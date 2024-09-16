// // import React, { useState, useEffect } from 'react';
// // import './App.css';

// // const App = () => {
// //   const [latitude, setLatitude] = useState('');
// //   const [longitude, setLongitude] = useState('');
// //   const [radius, setRadius] = useState(5);
// //   const [restaurants, setRestaurants] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [restaurantId, setRestaurantId] = useState('');
// //   const [singleRestaurant, setSingleRestaurant] = useState(null);
// //   const [page, setPage] = useState(1);
// //   const [limit, setLimit] = useState(10);

// //   useEffect(() => {
// //     fetchAllRestaurants();
// //   }, [page,limit]);

// //   const fetchAllRestaurants = async () => {
// //     setLoading(true);
// //     setError('');
// //     try {
// //       const response = await fetch(`/api/restaurants?page=${page}&limit=${limit}`);
// //       if (!response.ok) {
// //         throw new Error('Failed to fetch restaurants');
// //       }
// //       const data = await response.json();
// //       setRestaurants(data);
// //     } catch (err) {
// //       setError(err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };



// import React, { useState, useEffect } from 'react';
// import './App.css';

// const App = () => {
//   const [latitude, setLatitude] = useState('');
//   const [longitude, setLongitude] = useState('');
//   const [radius, setRadius] = useState(5);
//   const [restaurants, setRestaurants] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [restaurantId, setRestaurantId] = useState('');
//   const [singleRestaurant, setSingleRestaurant] = useState(null);
//   const [page, setPage] = useState(1);
//   const limit = 12; // Fixed limit of 15 entries per page

//   useEffect(() => {
//     fetchAllRestaurants();
//   }, [page]);

//   const fetchAllRestaurants = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const response = await fetch(`/api/restaurants?page=${page}&limit=${limit}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch restaurants');
//       }
//       const data = await response.json();
//       setRestaurants(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePrevPage = () => {
//     setPage((prevPage) => Math.max(1, prevPage - 1));
//   };

//   const handleNextPage = () => {
//     setPage((prevPage) => prevPage + 1);
//   };

//   const handleSearch = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const response = await fetch(`/api/restaurants/near?lat=${latitude}&lng=${longitude}&radius=${radius}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch restaurants');
//       }
//       const data = await response.json();
//       setRestaurants(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchRestaurantById = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const response = await fetch(`/api/restaurant/${restaurantId}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch restaurant');
//       }
//       const data = await response.json();
//       setSingleRestaurant(data);
//     } catch (err) {
//       setError(err.message);
//       setSingleRestaurant(null);
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   const renderStars = (rating) => {
//     const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
//     return <span className="stars">{stars}</span>;
//   };

//   return (
//     <div className="container">
//       <div className="header">
//         <h1 className="title">Restaurant Finder</h1>
//         <div className="id-search-section">
//           {/* <h2 className="section-title">Get Restaurant by ID</h2> */}
//           <div className="input-group">
//             <input
//               type="text"
//               placeholder="Restaurant ID"
//               value={restaurantId}
//               onChange={(e) => setRestaurantId(e.target.value)}
//               className="input"
//             />
//             <button 
//               onClick={fetchRestaurantById} 
//               disabled={loading}
//               className={`button ${loading ? 'loading' : ''}`}
//             >
//               {loading ? 'Fetching...' : 'Get Restaurant'}
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="search-section">
//         <h2 className="section-title">Search Nearby Restaurants</h2>
//         <div className="input-group">
//           <input
//             type="number"
//             placeholder="Latitude"
//             value={latitude}
//             onChange={(e) => setLatitude(e.target.value)}
//             className="input"
//           />
//           <input
//             type="number"
//             placeholder="Longitude"
//             value={longitude}
//             onChange={(e) => setLongitude(e.target.value)}
//             className="input"
//           />
//           <div className="slider-container">
//             <input
//               type="range"
//               min="1"
//               max="50"
//               value={radius}
//               onChange={(e) => setRadius(e.target.value)}
//               className="slider"
//             />
//             <span className="slider-value">{radius} km</span>
//           </div>
//           <button 
//             onClick={handleSearch} 
//             disabled={loading}
//             className={`button ${loading ? 'loading' : ''}`}
//           >
//             {loading ? 'Searching...' : 'Search Nearby'}
//           </button>
//         </div>
//       </div>

//       {singleRestaurant && (
//         <div className="single-restaurant">
//           <h3 className="restaurant-name">{singleRestaurant['Restaurant Name']}</h3>
//           <p><strong>Cuisine:</strong> {singleRestaurant['Cuisines']}</p>
//           <p><strong>Address:</strong> {singleRestaurant['Address']}</p>
//           <p><strong>Rating:</strong> {renderStars(singleRestaurant['Aggregate rating'])} ({singleRestaurant['Aggregate rating']})</p>
//           {singleRestaurant.featured_image && (
//             <img 
//               src={singleRestaurant.featured_image} 
//               alt={singleRestaurant['Restaurant Name']} 
//               className="restaurant-image"
//             />
//           )}
//         </div>
//       )}

//       {error && <p className="error">{error}</p>}

//       <div className="all-restaurants-section">
//         <h2 className="section-title">All Restaurants</h2>
//         <div className="restaurant-grid">
//           {restaurants.map((restaurant) => (
//             <div key={restaurant['Restaurant ID']} className="restaurant-card">
//               {restaurant.featured_image && (
//                 <img 
//                   src={restaurant.featured_image} 
//                   alt={restaurant['Restaurant Name']} 
//                   className="restaurant-image"
//                 />
//               )}
//               <h3 className="restaurant-name">{restaurant['Restaurant Name']}</h3>
//               <p><strong>Cuisine:</strong> {restaurant['Cuisines']}</p>
//               <p><strong>Address:</strong> {restaurant['Address']}</p>
//               <p><strong>Rating:</strong> {renderStars(restaurant['Aggregate rating'])} ({restaurant['Aggregate rating']})</p>
//             </div>
//           ))}
//         </div>
//       </div>
            
//       <div className="pagination">
//         <button 
//           onClick={handlePrevPage} 
//           disabled={page === 1 || loading}
//           className="pagination-button"
//         >
//           Prev 
//         </button>
//         {page}
//         <button 
//           onClick={handleNextPage} 
//           disabled={restaurants.length < limit || loading}
//           className="pagination-button"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import AllRestaurants from './AllRestaurants';
import RestaurantById from './RestaurantById';
import SearchNearby from './SearchNearby';
import ImageSearch from './ImageSearch';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="container">
        <Navbar />
        <Routes>
          <Route path="/image-search" element={<ImageSearch />} />
          <Route path="/restaurant-by-id" element={<RestaurantById />} />
          <Route path="/search-nearby" element={<SearchNearby />} />
          <Route path="/" element={<ImageSearch />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
