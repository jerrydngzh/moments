import React, { useEffect, useState } from 'react';
import Map from '../Map/map';

interface Location {
  coordinates: [number, number];
  memo: { 
    memo: string; 
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
  const [sortStateIndex, setSortStateIndex] = useState(3); // state variable to keep track of the current index

  const sortStates = ['title-asc', 'title-desc', 'date-asc', 'date-desc']; // array of sort states
  const sortStateDescriptions = {
    'title-asc': 'Title (Ascending)',
    'title-desc': 'Title (Descending)',
    'date-asc': 'Date (Ascending)',
    'date-desc': 'Date (Descending)',
  };
  
  const handleListItemClick = (memo) => {
    selectedMemo === memo ? setSelectedMemo(null) : setSelectedMemo(memo);
  };
  
  const handleSortButtonClick = () => {
    const newSortStateIndex = (sortStateIndex + 1) % sortStates.length; // calculate the new sort state index
    const sortState = sortStates[newSortStateIndex]; // use the new sort state index to get the sort state
    const [sortType, sortOrder] = sortState.split('-');
  
    const sortedLocations = [...locations].sort((a, b) => {
      if (sortType === 'title') {
        const aTitle = a.memo[0]?.title || '';
        const bTitle = b.memo[0]?.title || '';
        return sortOrder === 'asc' ? aTitle.localeCompare(bTitle) : bTitle.localeCompare(aTitle);
      } else if (sortType === 'date') {
        const aDate = a.memo[0]?.date ? Date.parse(a.memo[0]?.date) : 0;
        const bDate = b.memo[0]?.date ? Date.parse(b.memo[0]?.date) : 0;
        return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
      }
    });
  
    setSortedMemos(sortedLocations);
    setSortStateIndex(newSortStateIndex); // update the state with the new sort state index
  };
  
  const memosToDisplay = sortedMemos.length > 0 ? sortedMemos : locations;

  return (
    <>
      <div className='text-blue-800 bg-blue-100 hover:bg-white w-1/2 mb-2 p-2 text-center rounded-lg'>
        <button onClick={handleSortButtonClick}>Sort Memos: {sortStateDescriptions[sortStates[sortStateIndex]]}</button>      
      </div>
      {memosToDisplay.map((location, locIndex) => (
        <ul key={locIndex}>
          {location.memo.map((memo, memoIndex) => (
            <>
              <li key={memoIndex} onClick={() => handleListItemClick(memo)} className="rounded-lg p-2 cursor-pointer">
                <h2 className="font-bold font-lg">{memo.title}</h2>
              </li>
              {selectedMemo === memo && (
                <section className="bg-white p-2 mt-1 mb-2 rounded-lg">
                  <Map locations={[location]} view={'list'} />
                  <h4 className="font-bold">Date:</h4>
                  <p className="mb-2">{memo.date}</p>
                  <h4 className="font-bold">Location:</h4>
                  <p className="mb-2">{memo.location}</p>
                  <h4 className="font-bold">Description:</h4>
                  <p className="mb-2">{memo.memo}</p>
                </section>
              )}
            </>
          ))}
        </ul>
      ))}
    </>
  );
};

export default List;