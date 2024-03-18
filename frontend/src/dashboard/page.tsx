'use client'
import React, { useState, useEffect } from 'react';
import Popup from './Popup'; // Import the modified Popup component
import "./style.css"
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState({});
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [username, setUsername] = useState('');
  const [selectedLocationPop, setSelectedLocationPop] = useState(null);
  const [expandedLocations, setExpandedLocations] = useState({});
  const [newCategory, setNewCategory] = useState('');
  const [showPopup, setShowPopup] = useState(false); // State to manage the popup visibility

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const username = searchParams.get('username') || '';
      setUsername(username);
      // Fetch memo data from the server
      const response = await fetch(`https://localhost:8080/api/getMemos`);
      const data = await response.json();
      const { categories, locations } = data[username];
      setCategories(categories || []);
      setLocations(locations || {});
    } catch (error) {
      console.error('Error fetching memo data:', error);
    }
  };

  const handleLocationClick = (locationName) => {
    setSelectedLocation(locationName);
    setExpandedLocations({
      ...expandedLocations,
      [locationName]: !expandedLocations[locationName]
    });
  };

  const handleMemoClick = (memo, locationName) => {
    setSelectedMemo(memo);
    setSelectedLocationPop(locationName);
    setShowPopup(true); // Show the popup when memo is clicked
  };

  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      const remainingCategories = selectedCategories.filter((cat) => cat !== category);
      setSelectedCategories(remainingCategories);
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleNewCategoryChange = (event) => {
    setNewCategory(event.target.value);
  };

  const handleAddCategory = async () => {
    if (newCategory.trim() !== '' && !categories.includes(newCategory)) {
      try {
        await fetch('https://localhost:8080/api/updateCategories', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'updateUsernameCategories',
            username: username,
            locationName: "",
            memoIndex: "",
            categories: [...categories, newCategory]
          }),
        });
        setCategories([...categories, newCategory]);
        setNewCategory('');
      } catch (error) {
        console.error('Error updating categories:', error);
      }
    }
  };

  const handleDeleteCategory = async (categoryToDelete) => {
    const remainingCategories = categories.filter((category) => category !== categoryToDelete);
    try {
      // Update memo categories
      const updatedLocations = { ...locations };
      await Promise.all(Object.keys(updatedLocations).map(async (locationName) => {
        const memos = updatedLocations[locationName].memo;
        await Promise.all(memos.map(async (memo) => {
          if (memo.selectedCategories.includes(categoryToDelete)) {
            const memoIndex = updatedLocations[locationName].memo.findIndex((m) => m.memo === memo.memo);
            const updatedCategories = memo.selectedCategories.filter((cat) => cat !== categoryToDelete);
            // Remove category from memo first
            memo.selectedCategories = updatedCategories;
            // Update memo categories on the server
            await fetch('https://localhost:8080/api/updateCategories', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                action: 'updateMemoCategories',
                username: username,
                locationName: locationName,
                memoIndex: memoIndex,
                categories: updatedCategories
              }),
            });
          }
        }));
      }));

      // Update user categories
      await fetch('https://localhost:8080/api/updateCategories', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateUsernameCategories',
          username: username,
          locationName: '',
          memoIndex: '',
          categories: remainingCategories
        }),
      });
      setCategories(remainingCategories);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // Function to update categories of the selected memo
  const handleUpdateMemoCategories = async (updatedCategories) => {
    try {
      setSelectedMemo({
        ...selectedMemo,
        selectedCategories: updatedCategories
      });
  
      // Update memo categories on the server
      await fetch('https://localhost:8080/api/updateCategories', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateMemoCategories',
          username: username,
          locationName: selectedLocationPop,
          memoIndex: locations[selectedLocationPop].memo.findIndex((m) => m.memo === selectedMemo.memo),
          categories: updatedCategories
        }),
      });
  
      // Update user categories
      const updatedUserCategories = [...categories, ...updatedCategories.filter(cat => !categories.includes(cat))];
      await fetch('https://localhost:8080/api/updateCategories', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateUsernameCategories',
          username: username,
          locationName: '',
          memoIndex: '',
          categories: updatedUserCategories
        }),
      });
      setCategories(updatedUserCategories);
    } catch (error) {
      console.error('Error updating memo categories:', error);
    }
  };
  

  // Filter locations based on selected categories
  const filteredLocations = Object.keys(locations).reduce((filtered, locationName) => {
    const memos = locations[locationName].memo.filter((memo) =>
      selectedCategories.every((category) => memo.selectedCategories.includes(category))
    );
    if (memos.length > 0) {
      filtered[locationName] = { ...locations[locationName], memo: memos };
    }
    return filtered;
  }, {});

  return (
    <div className="dashboard-container">
      <h1>Memo Dashboard</h1>

      {/* Categories */}
      <div className="categories-container">
        <h2>Categories</h2>
        <div className="categories-table">
          <div className="category-row add-category-row">
            <input
              type="text"
              value={newCategory}
              onChange={handleNewCategoryChange}
              placeholder="Enter new category"
              className="category-input"
            />
            <button onClick={handleAddCategory} className="add-category-button">Add</button>
          </div>
          {categories.map((category, index) => (
            <div key={index} className="category-row">
              <input
                type="checkbox"
                value={category}
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="category-checkbox"
              />
              <span>{category}</span>
              <button onClick={() => handleDeleteCategory(category)} className="delete-category-button">Delete</button>
            </div>
          ))}
        </div>
      </div>

      {/* Locations */}
      <div>
        <h2>Locations</h2>
        {Object.keys(filteredLocations).map((locationName) => (
          <div key={locationName} className="location-box" onClick={() => handleLocationClick(locationName)}>
            <h3>{locationName}</h3>
            {expandedLocations[locationName] && (
              <div className="memo-box">
                {filteredLocations[locationName].memo.map((memo, index) => (
                  <div key={index} className="memo" onClick={() => handleMemoClick(memo, locationName)}>
                    {memo.memo}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Popup for selected memo */}
      {showPopup && selectedMemo && selectedLocationPop && (
        <Popup
          selectedMemo={selectedMemo}
          selectedLocationPop={selectedLocationPop}
          categories={categories}
          handleUpdateCategories={handleUpdateMemoCategories}
          handleClose={() => setShowPopup(false)} // Close the popup when close button is clicked
        />
      )}

      <Link to={'/createMemo?username='+username+''} className='buttonLink'>Create Memo</Link>
      <Link to={'/profile?username='+username+''} className='buttonLink'>Profile</Link>
      <Link to={'/lens?username='+username+''} className='buttonLink'>Lens</Link>
    </div>
  );
};

export default Dashboard;
