import React, { useState, useEffect } from "react";
import Header from "../Header/header";
import { MemoController } from "../../controllers/memo.controller";
import { useFirebaseAuth } from "../../contexts/FirebaseAuth.context";
import "./style.css";
import LocationList from "./components/LocationList/LocationList";
import { MemoType } from "../../models/memo";

const Dashboard = () => {
  
  const [memos, setMemos] = useState([]);
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
  const getLocations = (memoList:MemoType[]) => {
    const fetchedLocations = {};
    memoList.forEach((memo) => {
      if (fetchedLocations[memo.location.name]) {
        fetchedLocations[memo.location.name].push(memo);
      } else {
        fetchedLocations[memo.location.name] = [memo];
      }
    });
    return fetchedLocations;
  };
  

  const handleDeleteMemo = async (
    memo: any,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const newMemos = memos.filter((m) => m._id !== memo._id);
    setMemos(newMemos);
    event.stopPropagation();
    try {
      await MemoController.delete_memo(currentUser.uid, memo._id);
      // Update memos state by removing the deleted memo
      
    } catch (error) {
      console.error("Error deleting memo:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-2/3 text-left m-auto mt-10 bg-blue-200 p-10 pr-20 pl-20 rounded-3xl border-2 border-blue-800">
      <Header />

      <h1 className="text-blue-800 mb-6">Memo Dashboard</h1>

      <LocationList
        locations={getLocations(memos)}
        handleDeleteMemo={handleDeleteMemo}
      />
        
    </div>
  );
};

export default Dashboard;
