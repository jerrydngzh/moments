'use client'
import React, { useState, useEffect } from 'react';
import Popup from './Popup'; // Import the modified Popup component
import "./style.css"
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [tags, setTags] = useState([]);
  const [locations, setLocations] = useState({});
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [id, setID] = useState('');
  const [selectedLocationPop, setSelectedLocationPop] = useState(null);
  const [expandedLocations, setExpandedLocations] = useState({});
  const [newCategory, setNewCategory] = useState('');
  const [showPopup, setShowPopup] = useState(false); // State to manage the popup visibility
  const [userData, setUserData] = useState({});
  const [memos, setMemos] = useState({});
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const idFromQuery = searchParams.get('is') || '';
      setID(idFromQuery);
      // Fetch memo data from the server
      const response = await fetch(`http://localhost:3000/api/users/${idFromQuery}`);
      const data = await response.json();
      setUserData(data);
      setTags(data.tags || []);
      
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
    if (selectedTags.includes(category)) {
      const remainingTags = selectedTags.filter((cat) => cat !== category);
      setSelectedTags(remainingTags);
    } else {
      setSelectedTags([...selectedTags, category]);
    }
  };

  const handleNewCategoryChange = (event) => {
    setNewCategory(event.target.value);
  };

  const handleAddCategory = async () => {
    if (newCategory.trim() !== '' && !tags.includes(newCategory)) {
      try {
        await fetch('http://localhost:3000/api/memos/updateTags', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'updateUsernameTags',
            username: username,
            locationName: "",
            memoIndex: "",
            tags: [...tags, newCategory]
          }),
        });
        setTags([...tags, newCategory]);
        setNewCategory('');
      } catch (error) {
        console.error('Error updating tags:', error);
      }
    }
  };

  const handleDeleteCategory = async (categoryToDelete) => {
    const remainingTags = tags.filter((category) => category !== categoryToDelete);
    try {
      // Update memo tags
      const updatedLocations = { ...locations };
      await Promise.all(Object.keys(updatedLocations).map(async (locationName) => {
        const memos = updatedLocations[locationName].memo;
        await Promise.all(memos.map(async (memo) => {
          if (memo.selectedTags.includes(categoryToDelete)) {
            const memoIndex = updatedLocations[locationName].memo.findIndex((m) => m.memo === memo.memo);
            const updatedTags = memo.selectedTags.filter((cat) => cat !== categoryToDelete);
            // Remove category from memo first
            memo.selectedTags = updatedTags;
            // Update memo tags on the server
            await fetch('http://localhost:3000/api/memos/updateTags', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                action: 'updateMemoTags',
                username: username,
                locationName: locationName,
                memoIndex: memoIndex,
                tags: updatedTags
              }),
            });
          }
        }));
      }));

      // Update user tags
      await fetch('http://localhost:3000/api/memos/updateTags', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateUsernameTags',
          username: username,
          locationName: '',
          memoIndex: '',
          tags: remainingTags
        }),
      });
      setTags(remainingTags);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // Function to update tags of the selected memo
  const handleUpdateMemoTags = async (updatedTags) => {
    try {
      setSelectedMemo({
        ...selectedMemo,
        selectedTags: updatedTags
      });
  
      // Update memo tags on the server
      await fetch('http://localhost:3000/api/memos/updateTags', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateMemoTags',
          username: username,
          locationName: selectedLocationPop,
          memoIndex: locations[selectedLocationPop].memo.findIndex((m) => m.memo === selectedMemo.memo),
          tags: updatedTags
        }),
      });
  
      // Update user tags
      const updatedUserTags = [...tags, ...updatedTags.filter(cat => !tags.includes(cat))];
      await fetch('http://localhost:3000/api/memos/updateTags', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateUsernameTags',
          username: username,
          locationName: '',
          memoIndex: '',
          tags: updatedUserTags
        }),
      });
      setTags(updatedUserTags);
    } catch (error) {
      console.error('Error updating memo tags:', error);
    }
  };
  

  // Filter locations based on selected tags
  const filteredLocations = Object.keys(locations).reduce((filtered, locationName) => {
    const memos = locations[locationName].memo.filter((memo) =>
      selectedTags.every((category) => memo.selectedTags.includes(category))
    );
    if (memos.length > 0) {
      filtered[locationName] = { ...locations[locationName], memo: memos };
    }
    return filtered;
  }, {});

  return (
    <div className="dashboard-container">
      <h1>Memo Dashboard</h1>

      {/* Tags */}
      <div className="tags-container">
        <h2>Tags</h2>
        <div className="tags-table">
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
          {tags.map((category, index) => (
            <div key={index} className="category-row">
              <input
                type="checkbox"
                value={category}
                checked={selectedTags.includes(category)}
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
          tags={tags}
          handleUpdateTags={handleUpdateMemoTags}
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
