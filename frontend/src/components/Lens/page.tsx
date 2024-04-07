
import React, { useState, useEffect } from 'react';
import Map from './Map/map';
import Table from './Map/table';
import List from './List/list';
import MemoCalendar from './Calendar/calendar';
import { Link } from 'react-router-dom';
import { UserController } from '../../controllers/user.controller';
import { MemoController } from '../../controllers/memo.controller'

interface Location {
  coordinates: [number, number];
  memo: { 
    memo: string; 
    title: string; 
    date: string; 
    location: string; 
  }[];
}

const Lens: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [userID, setUserID] = useState('');
  const [userData, setUserData] = useState({});
  const [memos, setMemos] = useState({});
  const [view, setView] = useState('map');
  
  const fetchData = async () => {
    try {
      // NOTE: search for userID in path as query variable
      const searchParams = new URLSearchParams(window.location.search);
      const idFromQuery = searchParams.get('id') || '';
      setUserID(idFromQuery);
      
      const userData = await UserController.get_user_profile(idFromQuery)
      setUserData(userData);

      console.log("Memos: ", userData.memos);
      // memos is an array of memo IDs :: string
      fetchMemos(userData.memos);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }

  };

  const fetchMemos = async (memoID: any) => {
    try { 
      const fetchedLocations: Location[] = [];
      const searchParams = new URLSearchParams(window.location.search);
      const idFromQuery = searchParams.get('id') || '';
      setUserID(idFromQuery);
      console.log("user: ", idFromQuery); // right now userid shows up as empty, need to fix this

      for (const mid of memoID) {
        // const response = await fetch(`http://localhost:3000/api/memos/${userID}/${mid}`);
        // const memoData = await response.json();
        const result = await MemoController.get_memo(idFromQuery, mid);

        const locationName = result.location.name;
        const coordinates = result.location.coordinates;
        const memo = { title: result.name, memo: result.description, date: result.date, location: locationName};
        
        // Check if location already exists in fetchedLocations array
        const existingLocationIndex = fetchedLocations.findIndex(loc => loc.coordinates[0] === coordinates[0] && loc.coordinates[1] === coordinates[1]);
        
        if (existingLocationIndex !== -1) {
          // Location already exists, add memo to its memo array
          fetchedLocations[existingLocationIndex].memo.push(memo);
        } else {
          // Location doesn't exist, create a new Location object
          fetchedLocations.push({ coordinates: coordinates, memo: [memo] });
        }
      }
      
      setLocations(fetchedLocations);

      console.log("locations: ", locations);
      console.log("memos: ", memos);
    } catch (error) {
      console.error('Error fetching memo data:', error);
    }
  };
  

  useEffect(() => {

    fetchData();
    console.log(locations);

  }, []);

  return (
    <div className="lens w-2/3 text-left m-auto mt-10 bg-blue-200 p-10 pr-20 pl-20 rounded-3xl border-2 border-blue-800">
      <header className="flex flex-row justify-between mb-4">
        <Link to={'/createMemo?id='+userID+''} className='button-link text-blue-800 bg-blue-100 hover:bg-white border-blue-800 border-2 w-1/4 p-2 text-center rounded-lg'>Create Memo</Link>
        <Link to={'/profile?id='+userID+''} className='button-link text-blue-800 bg-blue-100 hover:bg-white border-blue-800 border-2 w-1/4 p-2 text-center rounded-lg'>Profile</Link>
        <Link to={'/dashboard?id='+userID+''} className='button-link text-blue-800 bg-blue-100 hover:bg-white border-blue-800 border-2 w-1/4 p-2 text-center rounded-lg'>Dashboard</Link>
      </header>
      <div id="lens-header" className="flex flex-row justify-between">
        <h1 className="text-blue-800 text-3xl mb-4">Lens</h1>
        <div>
          <button 
            onClick={() => setView('map')} 
            className={`button-link text-blue-800 bg-blue-100 hover:bg-blue-300 border-blue-800 border-2 p-2 text-center rounded-lg ${view === 'map' ? 'bg-blue-300' : ''}`}
          >
            Map
          </button>
          <button 
            onClick={() => setView('list')} 
            className={`button-link text-blue-800 bg-blue-100 hover:bg-blue-300 border-blue-800 border-2 p-2 text-center rounded-lg ${view === 'list' ? 'bg-blue-300' : ''}`}
          >
            List
          </button>
          <button 
            onClick={() => setView('calendar')} 
            className={`button-link text-blue-800 bg-blue-100 hover:bg-blue-300 border-blue-800 border-2 p-2 text-center rounded-lg ${view === 'calendar' ? 'bg-blue-300' : ''}`}
          >
            Calendar
          </button>
        </div>
      </div>
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      {(() => {
        switch (view) {
          case 'map':
            return (
              <>
                <Map locations={locations} view={'map'}/> 
                <Table locations={locations} />
              </>
            );
          case 'list':
            return (
              <>
                <List locations={locations} />
              </>
            );
          case 'calendar':
            return (
              <>
                <MemoCalendar locations={locations} />
              </>
            );
          default:
            return null;
        }
      })()}
    </div>
  );
};

export default Lens;