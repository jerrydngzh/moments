import React, { useState } from "react";
import Details from "./details";

const DEFAULT_SORT_STATE = 3; // default sort state index for the sortStates array

interface Location {
  coordinates: [number, number];
  memo: {
    description: string;
    title: string;
    date: string;
    location: string;
  }[];
}

interface MapProps {
  locations: Location[];
}

const List: React.FC<MapProps> = ({ locations }) => {
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [sortedMemos, setSortedMemos] = useState([]);
  const [sortStateIndex, setSortStateIndex] = useState(DEFAULT_SORT_STATE); // state variable to keep track of the current index

  const sortStates = ["title-asc", "title-desc", "date-asc", "date-desc"]; // array of sort states
  const sortStateDescriptions = {
    "title-asc": "Title (A-Z)",
    "title-desc": "Title (Z-A)",
    "date-asc": "Date (Old-New)",
    "date-desc": "Date (New-Old)",
  };

  const handleListItemClick = (memo) => {
    selectedMemo === memo ? setSelectedMemo(null) : setSelectedMemo(memo);
  };

  const handleSortButtonClick = () => {
    const newSortStateIndex = (sortStateIndex + 1) % sortStates.length; // calculate the new sort state index
    const sortState = sortStates[newSortStateIndex]; // use the new sort state index to get the sort state
    const [sortType, sortOrder] = sortState.split("-");

    const sortedLocations = [...locations].sort((a, b) => {
      if (sortType === "title") {
        const aTitle = a.memo[0]?.title || "";
        const bTitle = b.memo[0]?.title || "";
        return sortOrder === "asc" ? aTitle.localeCompare(bTitle) : bTitle.localeCompare(aTitle);
      } else if (sortType === "date") {
        const aDate = a.memo[0]?.date ? Date.parse(a.memo[0]?.date) : 0;
        const bDate = b.memo[0]?.date ? Date.parse(b.memo[0]?.date) : 0;
        return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
      }
    });

    setSortedMemos(sortedLocations);
    setSortStateIndex(newSortStateIndex); // update the state with the new sort state index
  };

  const memosToDisplay = sortedMemos.length > 0 ? sortedMemos : locations;

  return (
    <>
      <div className="text-sky-800 mb-4">
        <button onClick={handleSortButtonClick} className="bg-sky-100 hover:bg-sky-50 mb-2 text-center rounded-lg">
          Sort Memos
        </button>
        <span className="ml-4 italic">
          Order: {sortStateDescriptions[sortStates[sortStateIndex]]}
        </span>
      </div>
      {memosToDisplay.map((location, locIndex) => (
        <ul key={locIndex}>
          {location.memo.map((memo, memoIndex) => (
            <>
              <li
                key={memoIndex}
                onClick={() => handleListItemClick(memo)}
                className="rounded-lg p-2 cursor-pointer bg-sky-50 hover:bg-white text-sky-950"
              >
                <h2 className="font-bold font-lg">{memo.title}</h2>
              </li>
              {selectedMemo === memo && <Details memo={memo} location={location} />}
            </>
          ))}
        </ul>
      ))}
    </>
  );
};

export default List;
