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
  
  const handleListItemClick = (memo) => {
    selectedMemo === memo ? setSelectedMemo(null) : setSelectedMemo(memo);
  };
  
  return (
    <>
      {locations.map((location, locIndex) => (
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