// @ts-nocheck
'use client'
import React, { useState, useEffect } from 'react';
import { MemoController } from '../../controllers/memo.controller';
import { MemoType } from '../../models/memo';

const Popup = ({userID, selectedMemo, selectedLocationPop, handleClose, handlePopupSubmit, Key }) => {
  const [reloadKey, setReloadKey] = useState(Key);
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(selectedMemo.name);
  const [editedMemo, setEditedMemo] = useState(selectedMemo.description);

  useEffect(() => {
    console.log(selectedMemo);
    if (reloadKey) {
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
  };

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
        </>
      )}
      <button onClick={handleClose}>Close</button>
    </div>
  );
};

export default Popup;
