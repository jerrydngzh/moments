import React from 'react';

interface Location {
    coordinates: [number, number];
    memo: { memo: string; selectedCategories: string[] }[];
  }
  
interface MapProps {
    locations: Location[];
}

const Calendar: React.FC<MapProps> = ({locations}) => {
    // Add your calendar component logic here

    return (
        <>
            <h1>Calendar</h1>
        </>
    );
};

export default Calendar;