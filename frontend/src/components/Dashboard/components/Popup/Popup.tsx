import { useState, useEffect } from 'react';
import { MemoController } from '../../../../controllers/memo.controller';
import { MemoType } from '../../../../models/memo';
import { useFirebaseAuth } from "../../../../contexts/FirebaseAuth.context";
import MemoForm from '../../../CreateMemo/components/MemoForm/memoForm';
import "./Popup.css"
const Popup = (props:{
  onClick: React.MouseEventHandler<HTMLDivElement>, 
  selectedMemo:MemoType, 
  handleClose:(event:React.MouseEvent<HTMLButtonElement, MouseEvent>) => void, 
  Key:boolean }) => {
  const [reloadKey, setReloadKey] = useState(props.Key);
  const [editing, setEditing] = useState(false);
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

  const handleEditSubmit = async(name:string, description:string, locationName:string, coordinates:[number,number] ) => {
    // For now, let's just log the new title and memo
    props.selectedMemo.name = name;
    props.selectedMemo.description = description;
    props.selectedMemo.location = {
      name: locationName,
      coordinates: coordinates,
    }
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
    setEditing(false);
  };

  return (
    <div className="popup" onClick={props.onClick}>
      <h2>Memo Details</h2>
      {editing ? (
        <>
        <div className='MemoForm'>
          <MemoForm onSubmit={handleEditSubmit} default_name={props.selectedMemo.name} default_description={props.selectedMemo.description}/>
        </div>
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
