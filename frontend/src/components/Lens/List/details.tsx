import React from 'react';
import Map from '../Map/map'; // adjust the import path as needed
import MediaDisplay from '../../CreateMemo/components/MediaDisplay/MediaDisplay';

interface Memo {
  _id:string,
  date: string;
  location: string;
  description: string;
}

interface Location {
    coordinates: [number, number];
    memo: { 
      _id:string,
      description: string; 
      title: string; 
      date: string; 
      location: string; 
    }[];
}

interface DetailsProps {
  memo: Memo;
  location: Location;
}

const Details: React.FC<DetailsProps> = ({ memo, location }) => {
  function fetchFilesByMemoid(memoid):string[] {
        const files:string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(memoid + "/")) {
                const base64Data = localStorage.getItem(key);
                files.push(base64Data); // File indices start from 1
            }
        }
        return files;
    }
  return (
    <section className="bg-white p-2 mt-1 mb-2 rounded-lg">
      <Map locations={[location]} view={'list'} />
      <MediaDisplay files={fetchFilesByMemoid(memo._id)}/>
      <h4 className="font-bold">Date:</h4>
      <p className="mb-2">{memo.date}</p>
      <h4 className="font-bold">Location:</h4>
      <p className="mb-2">{memo.location}</p>
      <h4 className="font-bold">Description:</h4>
      <p className="mb-2">{memo.description}</p>
    </section>
  );
};

export default Details;