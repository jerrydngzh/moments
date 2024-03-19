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
      setUserData(data[0]);
      setTags(data[0].tags || []);
      fetchMemos(data[0].memos);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchMemos = async (memoID) => {
    console.log(memoID);
    for (const id of memoID) {
      try {
        const response = await fetch(`http://localhost:3000/api/memos/${id}`);
        const data = await response.json(); 
        setMemos((prevMemos) => ({...prevMemos, [id]: data}));
        setLocations((prevLoc) => ({...prevLoc, [data.location.name]: data.location.coordinates}));
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
  };

  const handleNewTagChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setNewTag(event.target.value);
  };

  const handleAddTag = async () => {
    if (newTag.trim() !== '' && !tags.includes(newTag)) {
      try {
        await fetch('http://localhost:3000/api/memos/updateTags', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'updateUsernameTags',
            id: id,
            locationName: "",
            memoIndex: "",
            tags: [...tags, newTag]
          }),
        });
        setTags([...tags, newTag]);
        setNewTag('');
      } catch (error) {
        console.error('Error updating tags:', error);
      }
    }
  };

  const handleDeleteTag = async (tagToDelete: never) => {
    const remainingTags = tags.filter((tag) => tag !== tagToDelete);
    try {
      // Update memo tags
      const updatedLocations = { ...locations };
      await Promise.all(Object.keys(updatedLocations).map(async (locationName) => {
        const memos = updatedLocations[locationName].memo;
        await Promise.all(memos.map(async (memo: { selectedTags: any[]; memo: any; }) => {
          if (memo.selectedTags.includes(tagToDelete)) {
            const memoIndex = updatedLocations[locationName].memo.findIndex((m: { memo: any; }) => m.memo === memo.memo);
            const updatedTags = memo.selectedTags.filter((cat: any) => cat !== tagToDelete);
            // Remove tag from memo first
            memo.selectedTags = updatedTags;
            // Update memo tags on the server
            await fetch('http://localhost:3000/api/memos/updateTags', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                action: 'updateMemoTags',
                id: id,
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
          id: id,
          locationName: '',
          memoIndex: '',
          tags: remainingTags
        }),
      });
      setTags(remainingTags);
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  // Function to update tags of the selected memo
  const handleUpdateMemoTags = async (updatedTags: any[]) => {
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
          id: id,
          locationName: selectedLocationPop,
          memoIndex: locations[selectedLocationPop].memo.findIndex((m: { memo: any; }) => m.memo === selectedMemo.memo),
          tags: updatedTags
        }),
      });
  
      // Update user tags
      const updatedUserTags = [...tags, ...updatedTags.filter((cat: any) => !tags.includes(cat))];
      await fetch('http://localhost:3000/api/memos/updateTags', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateUsernameTags',
          id: id,
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
    // Filter memos based on selected tags and location
    const filteredMemos = Object.values(memos).filter(memo =>
      memo.location.name === locationName && selectedTags.every(tag => memo.selectedTags.includes(tag))
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
