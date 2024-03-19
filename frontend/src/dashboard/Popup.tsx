'use client'
import React, { useState } from 'react';

const Popup = ({ selectedMemo, selectedLocationPop, tags, handleUpdateTags, handleClose }) => {
  const [newTag, setNewTag] = useState('');

  const handleNewTagChange = (event) => {
    setNewTag(event.target.value);
  };

  const handleAddTag = () => {
    if (newTag.trim() !== '') {
      handleUpdateTags([...selectedMemo.selectedTags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = selectedMemo.selectedTags.filter(tag => tag !== tagToRemove);
    handleUpdateTags(updatedTags);
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
