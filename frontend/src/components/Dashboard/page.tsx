import React, { useState, useEffect } from "react";
import Header from "../Header/header";
import { MemoController } from "../../controllers/memo.controller";
import { useFirebaseAuth } from "../../contexts/FirebaseAuth.context";
import "./style.css";
import { MemoType } from "../../models/memo";
import LocationItem from "./components/LocationItem/LocationItem";

const Dashboard = () => {
  
  const [memos, setMemos] = useState<MemoType[]>([]);
  const { currentUser } = useFirebaseAuth();

  const fetchData = async () => {
    try {
      const memoData = await MemoController.get_all_memos(currentUser.uid);
      setMemos(memoData);
    } catch (error) {  
      if (error.response && error.response.status === 404) {
        return; 
      }
      console.error("Server Error:", error);
    }

  };
  const getLocations = (memoList:any[]) => {
    const fetchedLocations = {};
    memoList.forEach((memo) => {
      memo.id = memo._id;
      console.log(memo);
      if (fetchedLocations[memo.location.name]) {
        fetchedLocations[memo.location.name].push(memo);
      } else {
        fetchedLocations[memo.location.name] = [memo];
      }
    });
    return fetchedLocations;
  };
  
  const [expandedLocations, setExpandedLocations] = useState({});
  const handleLocationClick = (locationName) => {
    setExpandedLocations({
      ...expandedLocations,
      [locationName]: !expandedLocations[locationName],
    });
  };

  const handleDeleteMemo = async (
    memo: MemoType,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const newMemos = memos.filter((m) => m.id !== memo.id);
    setMemos(newMemos);
    event.stopPropagation();
    try {
      await MemoController.delete_memo(currentUser.uid, memo.id);
      // Update memos state by removing the deleted memo
      
    } catch (error) {
      console.error("Error deleting memo:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-2/3 text-left m-auto mt-10 bg-sky-200 p-10 pr-20 pl-20 rounded-3xl border-2 border-sky-300">
      <Header />

      <h1 className="text-sky-800 mb-6">Memo Dashboard</h1>
      <h2 className="text-sky-800 text-lg">Locations</h2>
      {Object.keys(getLocations(memos)).map((locationName) => (
        <LocationItem
          key={locationName}
          locationName={locationName}
          expanded={expandedLocations[locationName]}
          handleLocationClick={handleLocationClick}
          memos={getLocations(memos)[locationName]}
          handleDeleteMemo={handleDeleteMemo}
         />
      ))}
      
        
    </div>
  );
};

export default Dashboard;
