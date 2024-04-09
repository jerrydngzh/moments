import { useState, useEffect } from 'react';
import { MemoController } from '../../../../controllers/memo.controller';

const Popup = ({userID, selectedMemo, handleClose, Key }) => {
  const [reloadKey, setReloadKey] = useState(Key);
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(selectedMemo.name);
  const [editedMemo, setEditedMemo] = useState(selectedMemo.description);

  useEffect(() => {
    if (reloadKey) {
      setReloadKey(false);
    }
  }, [reloadKey, selectedMemo]);

  const handleEditClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
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
      date: new Date().toLocaleString(),
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
          <label htmlFor="name" className="text-xl text-blue-800">
          Title
          <input
            type="text"
            id="name"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          </label>
          <label htmlFor="name" className="text-xl text-blue-800">
          Memo
          <textarea
            value={editedMemo}
            onChange={(e) => setEditedMemo(e.target.value)}
          />
          </label>
          <button onClick={handleSaveClick}>Save</button>
        </>
      ) : (
      <>
        <p><strong>Title:</strong> {selectedMemo.name}</p>
        <p><strong>Location:</strong> {selectedMemo.location.name}</p>
        <p><strong>Date:</strong> {selectedMemo.date}</p>
        <p><strong>Memo:</strong> {selectedMemo.description}</p>
        <button onClick={(event) => handleEditClick(event)}>Edit</button>
        </>
      )}
      <button onClick={handleClose}>Close</button>
    </div>
  );
};

export default Popup;
