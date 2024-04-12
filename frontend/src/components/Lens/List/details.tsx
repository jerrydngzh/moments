import React from 'react';
import Map from '../Map/map'; // adjust the import path as needed
import MediaDisplay from '../../CreateMemo/components/MediaDisplay/MediaDisplay';

interface Memo {
  _id:string,
  date: string;
  location: string;
  description: string;
  media:string[]
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

    
  return (
    <section className="bg-white p-2 mt-1 mb-2 rounded-lg">
      <Map locations={[location]} view={'list'} />
      <MediaDisplay files={[]} media={memo.media} createMemo={false} />
      <h4 className="font-bold">Date:</h4>
      <p className="mb-2">{memo.date}</p>
      <h4 className="font-bold">Location:</h4>
      <p className="mb-2">{memo.location}</p>
      <MediaDisplay files={[]} media={memo.media} createMemo={false} />
      <h4 className="font-bold">Description:</h4>
      <p className="mb-2">{memo.description}</p>
    </section>
  );
};

export default Details;