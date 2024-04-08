import React from 'react';
import Map from '../Map/map'; // adjust the import path as needed

interface Memo {
  date: string;
  location: string;
  description: string;
}

interface Location {
    coordinates: [number, number];
    memo: { 
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
  return (
    <section className="bg-white p-2 mt-1 mb-2 rounded-lg">
      <Map locations={[location]} view={'list'} />
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