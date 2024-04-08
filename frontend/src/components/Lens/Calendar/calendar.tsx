import React, { useState } from 'react';
import Calendar from 'react-calendar';
import "./styles.css"

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

const MemoCalendar: React.FC<MapProps> = ({locations}) => {
    const [value, onChange] = useState(new Date());
    const [selectedDateMemos, setSelectedDateMemos] = useState([]);
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
        <div className="bg-blue-50 mt-4 mb-8 p-8 rounded-xl">
            <Calendar
            onChange={handleDateChange}
            value={value}
            tileContent={({ date, view }) => view === 'month' && memosByDate[date.toDateString()] ? <p className="memo-tile">{memosByDate[date.toDateString()].length} memos</p> : null}
            />
        </div>
        {isMemoOpen && (
            <div className='mb-2'>
                <h2>Selected Date: {value.toDateString()}</h2>
            </div>
        )}
        <ul>
            {isMemoOpen && selectedDateMemos.map((memo, index) => (
                <li key={index} className="bg-blue-50">{memo.title}</li>
            ))}
        </ul>
      </>
    );
  };

export default MemoCalendar;