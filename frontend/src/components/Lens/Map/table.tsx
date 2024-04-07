
import React from 'react';

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

const Table: React.FC<MapProps> = ({ locations }) => {

  return (
    <div>
        <table className="w-full table-auto">
        <thead className="justify-between">
            <tr className="bg-blue-950">
            <th className="px-16 py-2">
                <span className="text-blue-100">Title</span>
            </th>
            <th className="px-16 py-2">
                <span className="text-blue-100">Memo</span>
            </th>
            <th className="px-16 py-2">
                <span className="text-blue-100">Date</span>
            </th>
            </tr>
        </thead>
        <tbody>
            {locations.map((location, locIndex) => (
            location.memo.map((memo, memoIndex) => (
                <tr key={`${locIndex}-${memoIndex}`} className="bg-blue-100">
                  <td className="px-16 py-2 font-bold">{memo.title}</td>
                  <td className="px-16 py-2">{memo.memo}</td>
                  <td className="px-16 py-2">{memo.date}</td>
                </tr>
              ))
            ))}
        </tbody>
        </table>
    </div>
  );
};

export default Table;