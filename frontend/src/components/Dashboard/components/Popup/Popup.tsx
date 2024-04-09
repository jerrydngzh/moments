import { useState, useEffect } from 'react';
import { MemoController } from '../../../../controllers/memo.controller';
import { MemoType } from '../../../../models/memo';
import { useFirebaseAuth } from "../../../../contexts/FirebaseAuth.context";

const Popup = (props:{
  onClick: React.MouseEventHandler<HTMLDivElement>, 
  selectedMemo:MemoType, 
  handleClose:(event:React.MouseEvent<HTMLButtonElement, MouseEvent>) => void, 
  Key:boolean }) => {
  const [reloadKey, setReloadKey] = useState(props.Key);
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(props.selectedMemo.name);
  const [editedMemo, setEditedMemo] = useState(props.selectedMemo.description);
  const {currentUser} = useFirebaseAuth();

  useEffect(() => {
    if (reloadKey) {
      setReloadKey(false);
    }
  }, [reloadKey, props.selectedMemo]);

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
    props.selectedMemo.name = newTitle;
    props.selectedMemo.description = newMemo;
    const updatedMemo = {
      id: props.selectedMemo.id,
      description: props.selectedMemo.description,
      date: new Date().toLocaleString(),
      name: props.selectedMemo.name,
      location: props.selectedMemo.location
    };

    try{
      await MemoController.update_memo(currentUser.uid, updatedMemo);
    } catch (error) {
      console.error('Error updating memo:', error);
    }
  };

  return (
    <div className="popup" onClick={props.onClick}>
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
        <p><strong>Title:</strong> {props.selectedMemo.name}</p>
        <p><strong>Location:</strong> {props.selectedMemo.location.name}</p>
        <p><strong>Date:</strong> {props.selectedMemo.date}</p>
        <p><strong>Memo:</strong> {props.selectedMemo.description}</p>
        <button onClick={(event) => handleEditClick(event)}>Edit</button>
        </>
      )}
      <button onClick={props.handleClose}>Close</button>
    </div>
  );
};

export default Popup;
