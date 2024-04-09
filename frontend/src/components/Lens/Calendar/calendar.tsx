import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "./styles.css";

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

const MemoCalendar: React.FC<MapProps> = ({ locations }) => {
  const [value, setValue] = useState(new Date());
  const [key, setKey] = useState(Date.now());
  const [selectedDateMemos, setSelectedDateMemos] = useState([]);
  const [isMemoOpen, setIsMemoOpen] = useState(false);

  const memosByDate = locations.reduce((acc, location) => {
    location.memo.forEach((memo) => {
      const date = new Date(memo.date).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(memo);
    });
    return acc;
  }, {});

  useEffect(() => {
    setSelectedDateMemos(memosByDate[value.toDateString()] || []);
    setIsMemoOpen(true);
  }, [value]);

  const handleDateChange = (date) => {
    if (date.toDateString() !== value.toDateString()) {
      setValue(date);
    } else {
      setIsMemoOpen(!isMemoOpen);
    }
  };

  return (
    <>
      <div className="bg-blue-50 mt-4 mb-8 p-8 rounded-xl">
        <Calendar
          key={key}
          onChange={handleDateChange}
          value={value}
          tileContent={({ date, view }) =>
            view === "month" && memosByDate[date.toDateString()] ? (
              <p className="memo-tile">{memosByDate[date.toDateString()].length} memos</p>
            ) : null
          }
        />
      <button onClick={() => {
        setValue(new Date());
        setKey(Date.now());
      }} className="mt-4 border-blue-800 bg-blue-200">
        Back to Current Date
      </button>
      </div>
      {isMemoOpen && (
        <div className="mb-2">
          <h2>Selected Date: {value.toDateString()}</h2>
        </div>
      )}
      <ul>
        {isMemoOpen &&
          selectedDateMemos.map((memo, index) => (
            <li key={index} style={{ cursor: 'default', backgroundColor: '#EFF6FF'}}>
              {memo.title}
            </li>
          ))}
      </ul>
    </>
  );
};

export default MemoCalendar;
