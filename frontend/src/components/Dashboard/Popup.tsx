// @ts-nocheck
'use client'
import React, { useState, useEffect } from 'react';
import { MemoController } from '../../controllers/memo.controller';
import { MemoType } from '../../models/memo';

const Popup = ({userID, selectedMemo, selectedLocationPop, tags, handleUpdateTags, handleClose, handlePopupSubmit, Key }) => {
  //const [newTag, setNewTag] = useState('');
  const [reloadKey, setReloadKey] = useState(Key);
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(selectedMemo.name);
  const [editedMemo, setEditedMemo] = useState(selectedMemo.description);

  useEffect(() => {
    console.log(selectedMemo);
    if (reloadKey) {
      //setNewTag('');
      setReloadKey(false);
      handlePopupSubmit();
    }
    console.log(selectedMemo);
  }, [reloadKey, selectedMemo]);

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = () => {
    // Call a function to submit the edited title and memo
    handleEditSubmit(editedTitle, editedMemo);
    setEditing(false);
  };

  const handleEditSubmit = async(newTitle, newMemo) => {
    // Here, you can define the submission logic
    // For now, let's just log the new title and memo
    selectedMemo.name = newTitle;
    selectedMemo.description = newMemo;
    const updatedMemo = {
      id: selectedMemo._id,
      description: selectedMemo.description,
      date: selectedMemo.date,
      name: selectedMemo.name,
      location: selectedMemo.location
    };

    try{
      await MemoController.update_memo(userID, updatedMemo);
    } catch (error) {
      console.error('Error updating memo:', error);
    }
    // Call any necessary functions to update state or perform other actions
  };

  /*const handleNewTagChange = (event) => {
    setNewTag(event.target.value);
  };

  const handleAddTag = async () => {
    if (newTag.trim() !== '') {
      handleUpdateTags([...selectedMemo.tags, newTag], selectedMemo._id);

      try {
        // FIXME
        await fetch(`http://localhost:3000/api/memos/${selectedMemo._id}`);
        setReloadKey(Date.now()); // Reload by updating reloadKey
      } catch (error) {
        console.error('Error fetching memo data:', error);
      }
      setNewTag('');
      setReloadKey(true);
      
    }
  };

  const handleRemoveTag = async (tagToRemove) => {
    const updatedTags = selectedMemo.tags.filter(tag => tag !== tagToRemove);
    handleUpdateTags(updatedTags, selectedMemo._id);
    try {
      // FIXME
      await fetch(`http://localhost:3000/api/memos/${selectedMemo._id}`);
      setReloadKey(Date.now()); // Reload by updating reloadKey
    } catch (error) {
      console.error('Error fetching memo data:', error);
    }
    handleClose();
    setReloadKey(true);
  };*/

  return (
    <div className="popup">
      <h2>Memo Details</h2>
      {editing ? (
        <>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <textarea
            type="text"
            value={editedMemo}
            onChange={(e) => setEditedMemo(e.target.value)}
          />
          <button onClick={handleSaveClick}>Save</button>
        </>
      ) : (
      <>
        <p><strong>Title:</strong> {selectedMemo.name}</p>
        <p><strong>Memo:</strong> {selectedMemo.description}</p>
        <p><strong>Location:</strong> {selectedMemo.location.name}</p>
        <p><strong>Coordinates:</strong> {selectedMemo.location.coordinates}</p>
        <button onClick={handleEditClick}>Edit</button>
      {/*<p><strong>Tags:</strong>
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
        </div>*/}
        </>
      )}
      <button onClick={handleClose}>Close</button>
    </div>
  );
};

export default Popup;
