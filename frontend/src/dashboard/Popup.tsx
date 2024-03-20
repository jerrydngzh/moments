'use client'
import React, { useState, useEffect } from 'react';

const Popup = ({ selectedMemo, selectedLocationPop, tags, handleUpdateTags, handleClose, handlePopupSubmit }) => {
  const [newTag, setNewTag] = useState('');
  const [reloadKey, setReloadKey] = useState(true);

  useEffect(() => {
    if(reloadKey){
      setNewTag('');
      setReloadKey(false);
    }
  }, [reloadKey]);

  const handleNewTagChange = (event) => {
    setNewTag(event.target.value);
  };

  const handleAddTag = async() => {
    if (newTag.trim() !== '') {
      handleUpdateTags([...selectedMemo.tags, newTag], selectedMemo._id); 

      try {
        const response = await fetch(`http://localhost:3000/api/memos/${selectedMemo._id}`);
        const data = await response.json(); 
        selectedMemo = data;
      }catch (error) {
        console.error('Error fetching memo data:', error);
      }

      setNewTag('');
      handlePopupSubmit();
    }
  };

  const handleRemoveTag = async(tagToRemove) => {
    const updatedTags = selectedMemo.tags.filter(tag => tag !== tagToRemove);
    handleUpdateTags(updatedTags, selectedMemo._id);
    try {
      const response = await fetch(`http://localhost:3000/api/memos/${selectedMemo._id}`);
      const data = await response.json(); 
      selectedMemo = data;
    }catch (error) {
      console.error('Error fetching memo data:', error);
    }
  };

  return (
    <div className="popup">
      <h2>Memo Details</h2>
      <p><strong>Title:</strong> {selectedMemo.name}</p>
      <p><strong>Memo:</strong> {selectedMemo.description}</p>
      <p><strong>Location:</strong> {selectedMemo.location.name}</p>
      <p><strong>Coordinates:</strong> {selectedMemo.location.coordinates}</p>
      <p><strong>Tags:</strong>
        {selectedMemo.tags.map((tag, index) => (
          <span key={index}>
            {tag}
            <button onClick={() => handleRemoveTag(tag)}>Remove</button>
          </span>
        ))}
      </p>
      <div>
        <input
          type="text"
          value={newTag}
          onChange={handleNewTagChange}
          placeholder="Enter new tag"
        />
        <button onClick={handleAddTag}>Add</button>
      </div>
      <button onClick={handleClose}>Close</button>
    </div>
  );
};

export default Popup;
