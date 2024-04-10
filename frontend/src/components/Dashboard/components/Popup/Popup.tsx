import { useState, useEffect } from "react";
import { MemoController } from "../../../../controllers/memo.controller";
import { MemoType } from "../../../../models/memo";
import { useFirebaseAuth } from "../../../../contexts/FirebaseAuth.context";
import MemoForm from "../../../CreateMemo/components/MemoForm/memoForm";
import Map from "../../../Lens/Map/map";
import "./Popup.css";

const Popup = (props: {
  onClick: React.MouseEventHandler<HTMLDivElement>;
  selectedMemo: MemoType;
  handleClose: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  Key: boolean;
}) => {
  const [reloadKey, setReloadKey] = useState(props.Key);
  const [editing, setEditing] = useState(false);
  const { currentUser } = useFirebaseAuth();

  const location = () => {
    const coordinates = props.selectedMemo.location.coordinates;
    const memo_location_obj = {
      title: props.selectedMemo.name,
      description: props.selectedMemo.description,
      date: props.selectedMemo.date,
      location: props.selectedMemo.location.name,
    };
    return {
      coordinates: coordinates,
      memo: [memo_location_obj],
    };
  };
  useEffect(() => {
    if (reloadKey) {
      setReloadKey(false);
    }
  }, [reloadKey, props.selectedMemo]);

  const handleEditClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setEditing(true);
  };

  const handleEditSubmit = async (
    name: string,
    description: string,
    locationName: string,
    coordinates: [number, number]
  ) => {
    // For now, let's just log the new title and memo
    props.selectedMemo.name = name;
    props.selectedMemo.description = description;
    props.selectedMemo.location = {
      name: locationName,
      coordinates: coordinates,
    };
    const updatedMemo = {
      _id: props.selectedMemo._id,
      uid: props.selectedMemo.uid,
      description: props.selectedMemo.description,
      date: new Date().toLocaleString(),
      name: props.selectedMemo.name,
      location: props.selectedMemo.location,
    };

    try {
      await MemoController.update_memo(currentUser.uid, updatedMemo);
    } catch (error) {
      console.error("Error updating memo:", error);
    }
    setEditing(false);
  };

  return (
    <div className="popup bg-sky-200" onClick={props.onClick}>
      <h2 className="text-sky-800 font-bold text-xl">Memo Details</h2>
      {editing ? (
        <>
          <div className="MemoForm">
            <MemoForm
              onSubmit={handleEditSubmit}
              default_name={props.selectedMemo.name}
              default_description={props.selectedMemo.description}
            />
          </div>
        </>
      ) : (
        <>
          <div className="MapDisplay h-auto m-auto">
            <Map locations={[location()]} view={""}></Map>
          </div>
          <section className="text-sky-900 bg-sky-50 p-2 mt-4 rounded-lg">
            <p>
              <strong>Title:</strong> {props.selectedMemo.name}
            </p>
            <link
              rel="stylesheet"
              href="https://unpkg.com/leaflet/dist/leaflet.css"
            />
            <p>
              <strong>Location:</strong> {props.selectedMemo.location.name}
            </p>
            <p>
              <strong>Date:</strong> {props.selectedMemo.date}
            </p>
            <p>
              <strong>Memo:</strong> {props.selectedMemo.description}
            </p>
          </section>
          <button onClick={(event) => handleEditClick(event)} className="text-sky-50 w-1/6 bg-sky-500 hover:bg-sky-600 rounded-xl mt-4">
            Edit
          </button>
        </>
      )}
      <button onClick={props.handleClose} className="text-sky-50 w-1/6 bg-sky-500 hover:bg-sky-600 rounded-xl">
        Close
      </button>
    </div>
  );
};

export default Popup;
