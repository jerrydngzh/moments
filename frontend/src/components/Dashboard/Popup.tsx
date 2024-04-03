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
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

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
        {/* Display media */}
        <div className="media-container relative">
          {/* Display current media item */}
          <div className="media-item">
            {/* Determine the type of media based on the file URL */}
            {selectedMemo.media[currentMediaIndex].startsWith('data:image') ? (
              // If it's an image file
              <img src={selectedMemo.media[currentMediaIndex]} alt={`Media ${currentMediaIndex}`} className="w-full h-auto" />
            ) : selectedMemo.media[currentMediaIndex].startsWith('data:video') ? (
              // If it's a video file
              <video controls className="w-full h-auto">
                <source src={selectedMemo.media[currentMediaIndex]} />
                Your browser does not support the video tag.
              </video>
            ) : selectedMemo.media[currentMediaIndex].startsWith('data:audio') ? (
              // If it's an audio file
              <audio controls className="w-full">
                <source src={selectedMemo.media[currentMediaIndex]} />
                Your browser does not support the audio tag.
              </audio>
            ) : (
              // If it's another type of file (unsupported), you can display a message
              <div>This file type is not supported.</div>
            )}
          </div>
        </div>
        {/* Navigation buttons */}
        <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-md"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentMediaIndex((prevIndex) => (prevIndex === 0 ? selectedMemo.media.length - 1 : prevIndex - 1));
            }}          >
            Prev
          </button>
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-md"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentMediaIndex((prevIndex) => (prevIndex === selectedMemo.media.length - 1 ? 0 : prevIndex + 1));
            }}          >
            Next
          </button>
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
