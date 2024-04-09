import React from "react";

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

const Table: React.FC<MapProps> = ({ locations }) => {
  return (
    <div className="mt-4">
      <table className="w-full table-auto rounded">
        <thead className="justify-between">
          <tr className="bg-sky-700">
            <th className="px-16 py-2">
              <span className="text-sky-100">Title</span>
            </th>
            <th className="px-16 py-2">
              <span className="text-sky-100">Memo</span>
            </th>
            <th className="px-16 py-2">
              <span className="text-sky-100">Date</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {locations.map((location, locIndex) =>
            location.memo.map((memo, memoIndex) => (
              <tr key={`${locIndex}-${memoIndex}`} className="bg-sky-100">
                <td className="px-16 py-2 font-bold">{memo.title}</td>
                <td className="px-16 py-2">{memo.location}</td>
                <td className="px-16 py-2">{memo.date}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
