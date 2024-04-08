
import React, { useState, useEffect } from "react";
import Map from "./Map/map";
import Table from './Map/table';
import List from './List/list';
import MemoCalendar from './Calendar/calendar';
import { UserController } from "../../controllers/user.controller";
import { MemoController } from "../../controllers/memo.controller";
import Header from "../Header/header";
import { useFirebaseAuth } from "../../contexts/FirebaseAuth.context";
import { UserType } from "../../models/user";

interface Location {
  coordinates: [number, number];
  memo: { 
    description: string; 
    title: string; 
    date: string; 
    location: string; 
  }[];
}

const Lens: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [userData, setUserData] = useState<UserType>();
  const [memos, setMemos] = useState({});
  const [view, setView] = useState('map');
  const { currentUser } = useFirebaseAuth();

  const fetchUserData = async () => {
    try {
      const user = await UserController.get_user_data(currentUser.uid);
      setUserData(user);

      console.log("Memos: ", userData.memos);
      // memos is an array of memo IDs :: string
      fetchMemos(user.memos);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchMemos = async (memos: string[]) => {
    try {
      const fetchedLocations: Location[] = [];

      for (const mId of memos) {
        const result = await MemoController.get_memo(currentUser.uid, mId);

        //      1. locationName not used
        //      2. created memo below doesnt match `Location` interface above
        //      3. inconsistent naming
        const locationName = result.location.name;
        const coordinates = result.location.coordinates;

        const memo = {
          title: result.name,
          description: result.description,
          date: result.date,
          location: locationName
        };

        // Check if location already exists in fetchedLocations array
        const existingLocationIndex = fetchedLocations.findIndex(
          (loc) => loc.coordinates[0] === coordinates[0] && loc.coordinates[1] === coordinates[1]
        );

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
      console.error("Error fetching memo data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    console.log(locations);
  }, []);

  return (
    <div className="lens w-2/3 text-left m-auto mt-10 bg-blue-200 p-10 pr-20 pl-20 rounded-3xl border-2 border-blue-800">
      <Header></Header>
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
