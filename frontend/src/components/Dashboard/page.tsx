// @ts-nocheck
import React, { useState, useEffect } from "react";
import Popup from "./Popup";
import "./style.css";
import { Link } from "react-router-dom";
import { UserController } from "../../controllers/user.controller";
import { MemoController } from "../../controllers/memo.controller";
import Header from "../Header/header";

const Dashboard = () => {
  const [locations, setLocations] = useState({});
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [id, setID] = useState("");
  const [selectedLocationPop, setSelectedLocationPop] = useState(null);
  const [expandedLocations, setExpandedLocations] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [userData, setUserData] = useState({});
  const [memos, setMemos] = useState({});
  const [reloadDashboard, setReloadDashboard] = useState(true);
  const [key, setReloadKey] = useState(true);
  const [popReload, setPopReload] = useState(true);

  const fetchData = async () => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const idFromQuery = searchParams.get("id") || "";
      setID(idFromQuery);

      const data = await UserController.get_user_data(idFromQuery);
      setUserData(data);
      fetchMemos(data.memos);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchMemos = async (memoID) => {
    try {
      const fetchedMemos: { [key: string]: MemoType } = {};
      const fetchedLocations: { [key: string]: [number, number] } = {};
      const searchParams = new URLSearchParams(window.location.search);
      const idFromQuery = searchParams.get("id") || "";
      setID(idFromQuery);
      for (const mid of memoID) {
        const data = await MemoController.get_memo(idFromQuery, mid);
        fetchedMemos[mid] = data;
        fetchedLocations[data.location.name] = data.location.coordinates;
      }

      setMemos((prevMemos) => ({ ...prevMemos, ...fetchedMemos }));
      setLocations((prevLocations) => ({
        ...prevLocations,
        ...fetchedLocations,
      }));
    } catch (error) {
      console.error("Error fetching memos:", error);
    }
  };

  const handlePopupSubmit = () => {
    setReloadKey((prevKey) => !prevKey); // Toggle the key to force re-rendering of the popup
    setPopReload(false);
    setShowPopup(true);
  };

  useEffect(() => {
    if (reloadDashboard) {
      fetchData();
      setReloadDashboard(false);
    }
    //console.log(memos);
    //console.log(locations);
  }, [reloadDashboard]);

  const handleLocationClick = (locationName) => {
    setSelectedLocation(locationName);
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

  const filteredLocations: { [key: string]: { [key: string]: any } } =
    Object.keys(locations).reduce(
      (filtered: { [key: string]: { [key: string]: any } }, locationName) => {
        const filteredMemos: MemoType[] = [];
        for (const memoId in memos) {
          if (Object.prototype.hasOwnProperty.call(memos, memoId)) {
            const memo = memos[memoId];
            if (
              memo.location &&
              memo.location.name === locationName
            ) {
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
      },
      {}
    );

  const handleDeleteMemo = async (
    memo: any,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> => {
    event.stopPropagation();
    console.log(memo);
    try {
      await MemoController.delete_memo(id, memo._id);
      // Update userData.memos array by removing the deleted memo
      const updatedMemos = userData.memos.filter((m: any) => m !== memo._id);
      userData.memos = updatedMemos;
      setUserData(userData);
      const searchParams = new URLSearchParams(window.location.search);
      const idFromQuery = searchParams.get("id") || "";
      // Update user data by sending a PUT request
      const editResponse = await UserController.update_user(
        idFromQuery,
        userData
      );
      console.log("Edited user: ", editResponse);

      setReloadDashboard(true);
      fetchData();
      // Optionally handle success response
    } catch (error) {
      console.error("Error deleting memo:", error);
      // Provide user feedback or handle error state
    }
  };

  return (
    <div className="w-2/3 text-left m-auto mt-10 bg-blue-200 p-10 pr-20 pl-20 rounded-3xl border-2 border-blue-800">
      <Header id={id}></Header>

      <h1 className="text-blue-800 mb-6">Memo Dashboard</h1>

      <div className="mt-8">
        <h2 className="text-blue-800 text-lg">Locations</h2>
        {Object.keys(filteredLocations).length === 0 ? (
          <p className="italic text-blue-800 opacity-80">
            No locations to display.
          </p>
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
          userID={id}
          selectedMemo={selectedMemo}
          selectedLocationPop={selectedLocationPop}
          handleClose={() => setShowPopup(false)}
          handlePopupSubmit={handlePopupSubmit}
          Key={popReload}
        />
      )}
    </div>
  );
};

export default Dashboard;
