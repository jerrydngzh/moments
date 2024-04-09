import { useState } from "react";
import Popup from "../Popup/Popup";
import "./MemoItem.css"
import { MemoType } from "../../../../models/memo";

const MemoItem = (props:{ 
    memo:MemoType, 
    handleDeleteMemo:(memo:MemoType,event:React.MouseEvent<HTMLButtonElement, MouseEvent>) => void, 
    locationName:string 
     }) => {
        const [showPopup, setShowPopup] = useState(false);
        const handleMemoClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            event.stopPropagation();
            setShowPopup(true);
        };        
        const closePopup = (event:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            event.stopPropagation();
            setShowPopup(false);
        }
        const clickPopup = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            event.stopPropagation();
        }
  return (
    <div className="memo-item">
            <div className="memo-content" onClick={(event) => handleMemoClick(event)}>
                <span className="memo-name">{props.memo.name}</span>
                <button className="delete-button" onClick={(event) => props.handleDeleteMemo(props.memo, event)}>Delete</button>
            </div>
      
      {showPopup && (
        <Popup
            onClick={(event) => clickPopup(event)}
            key={props.memo.id}
            selectedMemo={props.memo}
            handleClose={(event) => closePopup(event)}
            Key={true}
        />
        )}
    </div>
    
    );
};

export default MemoItem;
