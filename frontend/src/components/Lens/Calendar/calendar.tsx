import React from 'react';
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
        onChange(date);
        setSelectedDateMemos(memosByDate[date.toDateString()] || []);
    };

    return (
      <div>
        <Calendar
          onChange={handleDateChange}
          value={value}
          tileContent={({ date, view }) => view === 'month' && memosByDate[date.toDateString()] ? <p>{memosByDate[date.toDateString()].length} memos</p> : null}
        />
        <ul className="mt-8">
            {selectedDateMemos.map((memo, index) => (
                <li key={index}>{memo.title}</li>
            ))}
        </ul>
      </div>
    );
  };

export default MemoCalendar;