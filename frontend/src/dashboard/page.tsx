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
  const [newTag, setNewTag] = useState('');
  const [showPopup, setShowPopup] = useState(false); // State to manage the popup visibility
  const [userData, setUserData] = useState({});
  const [memos, setMemos] = useState({});
  const [reloadDashboard, setReloadDashboard] = useState(true); // State to control dashboard reload

  useEffect(() => {
    if (reloadDashboard) {
      fetchData();
      setReloadDashboard(false); // Reset reload flag
    }
  }, [reloadDashboard]);

  const fetchData = async () => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const idFromQuery = searchParams.get('id') || '';
      setID(idFromQuery);
      // Fetch memo data from the server
      const response = await fetch(`http://localhost:3000/api/users/${idFromQuery}`);
      const data = await response.json();
      console.log(data);
      setUserData(data);
      setTags(data.tags || []);
      fetchMemos(data.memos);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchMemos = async (memoID: any) => {
    console.log(memoID);
    for (const id of memoID) {
      try {
        const response = await fetch(`http://localhost:3000/api/memos/${id}`);
        const data = await response.json(); 
        setMemos({...memos, [id]:data});
        console.log(memos);
        setLocations({...locations, [data.location.name]: data.location.coordinates});
      } catch (error) {
        console.error('Error fetching memo data:', error);
      }
    }
  };
  

  const handleLocationClick = (locationName: string | React.SetStateAction<null>) => {
    console.log(locationName);
    setSelectedLocation(locationName);
    setExpandedLocations({
      ...expandedLocations,
      [locationName]: !expandedLocations[locationName]
    });
  };

  const handleMemoClick = (memo: React.SetStateAction<null>, locationName: string | React.SetStateAction<null>) => {
    setSelectedMemo(memo);
    setSelectedLocationPop(locationName);
    setShowPopup(true); // Show the popup when memo is clicked
  };

  const handleTagChange = (tag: never) => {
    if (selectedTags.includes(tag)) {
      const remainingTags = selectedTags.filter((cat) => cat !== tag);
      setSelectedTags(remainingTags);
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
    setReloadDashboard(true);
  };

  const handleNewTagChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setNewTag(event.target.value);
    setReloadDashboard(true);
  };

  const handleAddTag = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const idFromQuery = searchParams.get('id') || '';
    setID(idFromQuery);
    console.log(idFromQuery);
    if (newTag.trim() !== '' && !tags.includes(newTag)) {
      try {
        const updateUserResponse  =  await fetch(`http://localhost:3000/api/users/${idFromQuery}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({tags: [...tags, newTag]}),
        });
        const data = await updateUserResponse .json();
        if (data.success) {
          setTags([...tags, newTag]);
          setNewTag('');
        }
      } catch (error) {
        console.error('Error updating tags:', error);
      }
    }
    setReloadDashboard(true);
  };

  const handleDeleteTag = async (tagToDelete: never) => {
    console.log(memos);
    // Filter out the deleted tag from the user's tags list
    const remainingTags = tags.filter((tag) => tag !== tagToDelete);
    try {
      // Update memo tags
      const updatedLocations = { ...locations };
      // Iterate over each location
      for (const location in updatedLocations) {
        console.log(location);
        for (const memo in memos) {
          console.log(memos[memo]);
          if (memos[memo].location.name === location) {
            if (memos[memo].tags.includes(tagToDelete)) {
              // If the memo contains the deleted tag, update its selected tags
              const updatedTags = memos[memo].tags.filter((cat: any) => cat !== tagToDelete);
              // Remove tag from memo first
              memos[memo].tags = updatedTags;
              // Update memo tags on the server
              await fetch(`http://localhost:3000/api/memos/${memos[memo]._id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tags: updatedTags }),
              });
            }
          }
        }
      }
  
      const searchParams = new URLSearchParams(window.location.search);
      const idFromQuery = searchParams.get('id') || '';
      // Update user tags on the server
      console.log(remainingTags);
      await fetch(`http://localhost:3000/api/users/${idFromQuery}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tags: remainingTags }),
      });
      // Update the user's tags list in the component state
      setTags(remainingTags);
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
    setReloadDashboard(true);
  };
  
  

  // Function to update tags of the selected memo
  const handleUpdateMemoTags = async (updatedTags: any[], memoid: any) => {
    try {
      setSelectedMemo({
        ...selectedMemo,
        selectedTags: updatedTags
      });
  
      // Update memo tags on the server
      await fetch(`http://localhost:3000/api/memos/${memoid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({tags: updatedTags}),
      });
      const searchParams = new URLSearchParams(window.location.search);
      const idFromQuery = searchParams.get('id') || '';
      // Update user tags
      const updatedUserTags = [...tags, ...updatedTags.filter((cat: any) => !tags.includes(cat))];
      await fetch(`http://localhost:3000/api/users/${idFromQuery}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({tags: updatedUserTags}),
      });
      setTags(updatedUserTags);
    } catch (error) {
      console.error('Error updating memo tags:', error);
    }
    setReloadDashboard(true);
  };
  

  // Filter locations based on selected tags
  const filteredLocations = Object.keys(locations).reduce((filtered, locationName) => {
    // Filter memos based on selected tags and location
    const filteredMemos = Object.values(memos).filter(memo =>
      memo.location.name === locationName && selectedTags.every(tag => memo.tags.includes(tag))
    );
  
    // Check if there are any memos for the current location after filtering
    if (filteredMemos.length > 0) {
      filtered[locationName] = {
        ...locations[locationName],
        memo: filteredMemos
      };
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
          <div className="tag-row add-tag-row">
            <input
              type="text"
              value={newTag}
              onChange={handleNewTagChange}
              placeholder="Enter new tag"
              className="tag-input"
            />
            <button onClick={handleAddTag} className="add-tag-button">Add</button>
          </div>
          {tags.map((tag, index) => (
            <div key={index} className="tag-row">
              <input
                type="checkbox"
                value={tag}
                checked={selectedTags.includes(tag)}
                onChange={() => handleTagChange(tag)}
                className="tag-checkbox"
              />
              <span>{tag}</span>
              <button onClick={() => handleDeleteTag(tag)} className="delete-tag-button">Delete</button>
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
                {/* Filter memos for the current location */}
                {Object.values(memos).filter((memo) => memo.location.name === locationName).map((memo, index) => (
                  <div key={index} className="memo" onClick={() => handleMemoClick(memo, locationName)}>
                    {memo.description}
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
          tags={memos.tags}
          handleUpdateTags={handleUpdateMemoTags}
          handleClose={() => setShowPopup(false)} // Close the popup when close button is clicked
        />
      )}

      <Link to={'/createMemo?id='+id+''} className='buttonLink'>Create Memo</Link>
      <Link to={'/profile?id='+id+''} className='buttonLink'>Profile</Link>
      <Link to={'/lens?id='+id+''} className='buttonLink'>Lens</Link>
    </div>
  );
};

export default Dashboard;
