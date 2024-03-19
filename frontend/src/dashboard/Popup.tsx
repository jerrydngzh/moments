'use client'
import React, { useState, useEffect } from 'react';

const Popup = ({ selectedMemo, selectedLocationPop, tags, handleUpdateTags, handleClose }) => {
  const [newTag, setNewTag] = useState('');
  const [reloadKey, setReloadKey] = useState(true);

  useEffect(() => {
    // Reset newTag state when the component is reloaded
    if(reloadKey){
      setNewTag('');
      setReloadKey(false);
    }
  }, [reloadKey]);

  const handleNewTagChange = (event) => {
    setNewTag(event.target.value);
  };

  const handleAddTag = () => {
    if (newTag.trim() !== '') {
      handleUpdateTags([...selectedMemo.tags, newTag], selectedMemo._id);

      setReloadKey(true);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = selectedMemo.tags.filter(tag => tag !== tagToRemove);
    handleUpdateTags(updatedTags, selectedMemo._id);
    setReloadKey(true);
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
