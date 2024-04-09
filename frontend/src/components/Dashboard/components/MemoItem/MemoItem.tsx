import { useState } from "react";
import Popup from "../Popup/Popup";
import { useFirebaseAuth } from "../../../../contexts/FirebaseAuth.context";
import "./MemoItem.css"

const MemoItem = (props:{ 
    memo:any, 
    handleDeleteMemo:(memo:any,event:React.MouseEvent<HTMLButtonElement, MouseEvent>) => void, 
    locationName:string 
     }) => {
        const [showPopup, setShowPopup] = useState(false);
        const {currentUser} = useFirebaseAuth();
        const handleMemoClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            event.stopPropagation();
            setShowPopup(true);
        };        
        const closePopup = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            event.stopPropagation();
            setShowPopup(false);
        }
  return (
    <div className="memo-item">
            <div className="memo-content" onClick={(event) => handleMemoClick(event)}>
                <span className="memo-name">{props.memo.name}</span>
                <button className="delete-button" onClick={(event) => props.handleDeleteMemo(props.memo, event)}>Delete</button>
            </div>
      
      {showPopup && (
        <Popup
          key={props.memo._id}
          userID={currentUser.uid}
          selectedMemo={props.memo}
          handleClose={(event) => closePopup(event)}
          Key={true}
        />
        )}
    </div>
    
    );
};

export default MemoItem;
