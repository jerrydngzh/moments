'use client'
import React, { useState } from 'react';

const Popup = ({ selectedMemo, selectedLocationPop, categories, handleUpdateCategories, handleClose }) => {
  const [newCategory, setNewCategory] = useState('');

  const handleNewCategoryChange = (event) => {
    setNewCategory(event.target.value);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() !== '') {
      handleUpdateCategories([...selectedMemo.selectedCategories, newCategory]);
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (categoryToRemove) => {
    const updatedCategories = selectedMemo.selectedCategories.filter(category => category !== categoryToRemove);
    handleUpdateCategories(updatedCategories);
  };

  return (
    <div className="popup">
      <h2>Memo Details</h2>
      <p><strong>Memo:</strong> {selectedMemo.memo}</p>
      <p><strong>Location:</strong> {selectedLocationPop}</p>
      <p><strong>Categories:</strong>
        {selectedMemo.selectedCategories.map((category, index) => (
          <span key={index}>
            {category}
            <button onClick={() => handleRemoveCategory(category)}>Remove</button>
          </span>
        ))}
      </p>
      <div>
        <input
          type="text"
          value={newCategory}
          onChange={handleNewCategoryChange}
          placeholder="Enter new category"
        />
        <button onClick={handleAddCategory}>Add</button>
      </div>
      <button onClick={handleClose}>Close</button>
    </div>
  );
};

export default Popup;
