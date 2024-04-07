import React, { useState } from 'react';
import Calendar from 'react-calendar'

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

const MemoCalendar: React.FC<MapProps> = ({locations}) => {
    const [value, onChange] = React.useState(new Date());
    const [selectedDateMemos, setSelectedDateMemos] = React.useState([]);
    const [isMemoOpen, setIsMemoOpen] = useState(false);

    const memosByDate = locations.reduce((acc, location) => {
        location.memo.forEach(memo => {
          const date = new Date(memo.date).toDateString();
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(memo);
        });
        return acc;
      }, {});

      const handleDateChange = (date) => {
        if (date.toDateString() === value.toDateString()) {
            setIsMemoOpen(!isMemoOpen);
        } else {
            onChange(date);
            setSelectedDateMemos(memosByDate[date.toDateString()] || []);
            setIsMemoOpen(true);
        }
      };

    return (
      <>
        <div className="bg-blue-50 mt-4 mb-4 p-4 rounded-xl">
            <Calendar
            onChange={handleDateChange}
            value={value}
            tileContent={({ date, view }) => view === 'month' && memosByDate[date.toDateString()] ? <p>{memosByDate[date.toDateString()].length} memos</p> : null}
            />
        </div>
        {isMemoOpen && (
            <>
                <h2>Selected Date: {value.toDateString()}</h2>
            </>
        )}
        <ul>
            {isMemoOpen && selectedDateMemos.map((memo, index) => (
                <li key={index}>{memo.title}</li>
            ))}
        </ul>
      </>
    );
  };

export default MemoCalendar;