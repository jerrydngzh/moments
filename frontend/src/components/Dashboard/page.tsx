import React, { useState, useEffect } from "react";
import Popup from "./Popup";
import Header from "../Header/header";
import { MemoType } from "../../models/memo";
import { MemoController } from "../../controllers/memo.controller";
import { useFirebaseAuth } from "../../contexts/FirebaseAuth.context";
import "./style.css";

const Dashboard = () => {
  const [locations, setLocations] = useState({});
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [selectedLocationPop, setSelectedLocationPop] = useState(null);
  const [expandedLocations, setExpandedLocations] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [memos, setMemos] = useState<MemoType[]>([]);
  const [popReload, setPopReload] = useState(true);
  const { currentUser } = useFirebaseAuth();

  const fetchData = async () => {
    try {
      const memoData = await MemoController.get_all_memos(currentUser.uid);
      setMemos(memoData);
      const fetchedLocations: { [key: string]: [number, number] } = {};
      memoData.forEach((memo) => {
        memo.id = memo._id;
        fetchedLocations[memo.location.name] = memo.location.coordinates;
      });
  
      setLocations((prevLocations) => ({
        ...prevLocations,
        ...fetchedLocations,
      }));

    } catch (error) {
      if (error.response && error.response.status >= 500 && error.response.status < 600) {
        console.error("Server Error:", error);
      } else if (error.response && error.response.status === 404) {
        return; 
      }
    }

  };

  const handlePopupSubmit = () => {
    setPopReload(false);
    setShowPopup(true);
  };

  const handleLocationClick = (locationName) => {
    setExpandedLocations({
      ...expandedLocations,
      [locationName]: !expandedLocations[locationName],
    });
  };

  const handleMemoClick = (memo, locationName) => {
    setSelectedMemo(memo);
    setSelectedLocationPop(locationName);
    setShowPopup(true);
  };

  // FIXME: this function is too long and convoluted, refactor
  const filteredLocations: { [key: string]: { [key: string]: any } } = Object.keys(
    locations
  ).reduce((filtered: { [key: string]: { [key: string]: any } }, locationName) => {
    const filteredMemos: MemoType[] = [];
    for (const memoId in memos) {
      if (Object.prototype.hasOwnProperty.call(memos, memoId)) {
        const memo = memos[memoId];
        if (memo.location && memo.location.name === locationName) {
          filteredMemos.push(memo);
        }
      }
    }

    if (filteredMemos.length > 0) {
      filtered[locationName] = {
        ...locations[locationName],
        memo: filteredMemos,
      };
    }

    return filtered;
  }, {});

  // FIXME: this function is broken, remove `//@ts-nocheck` and fix
  const handleDeleteMemo = async (
    memo: any,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();

    try {
      await MemoController.delete_memo(currentUser.uid, memo._id);
      // Update memos state by removing the deleted memo
      console.log(memos);
      setMemos(prevMemos => prevMemos.filter(m => m.id !== memo._id));

    } catch (error) {
      console.error("Error deleting memo:", error);
    }
  };

  // FIXME: why is reload dashboard needed? surely theres a better way to do this
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-2/3 text-left m-auto mt-10 bg-blue-200 p-10 pr-20 pl-20 rounded-3xl border-2 border-blue-800">
      <Header />

      <h1 className="text-blue-800 mb-6">Memo Dashboard</h1>

      <div className="mt-8">
        <h2 className="text-blue-800 text-lg">Locations</h2>
        {Object.keys(filteredLocations).length === 0 ? (
          <p className="italic text-blue-800 opacity-80">No locations to display.</p>
        ) : (
          Object.keys(filteredLocations).map((locationName) => (
            <div
              key={locationName}
              className="location-box"
              onClick={() => handleLocationClick(locationName)}
            >
              <h3>{locationName}</h3>
              {expandedLocations[locationName] && (
                <div className="memo-box">
                  {filteredLocations[locationName].memo.map((memo, index) => (
                    <div
                      key={index}
                      className="memo"
                      onClick={() => handleMemoClick(memo, locationName)}
                    >
                      {memo.name}
                      <button
                        onClick={(event) => handleDeleteMemo(memo, event)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showPopup && selectedMemo && selectedLocationPop && (
        <Popup
          key={selectedMemo._id}
          userID={currentUser.uid}
          selectedMemo={selectedMemo}
          handleClose={() => setShowPopup(false)}
          handlePopupSubmit={handlePopupSubmit}
          Key={popReload}
        />
      )}
    </div>
  );
};

export default Dashboard;
