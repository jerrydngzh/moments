// @ts-nocheck
import React, { useState, useEffect } from "react";
import Map from "./map";
import { UserController } from "../../controllers/user.controller";
import { MemoController } from "../../controllers/memo.controller";
import Header from "../Header/header";
import { useFirebaseAuth } from "../../contexts/FirebaseAuth.context";
import { UserType } from "../../models/user";

interface Location {
  coordinates: [number, number];
  memo: { memo: string; selectedCategories: string[] }[];
}

const Lens: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [userData, setUserData] = useState<UserType>();
  const [memos, setMemos] = useState({});
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

        // FIXME
        //      1. locationName not used
        //      2. created memo below doesnt match `Location` interface above
        //      3. inconsistent naming
        const locationName = result.location.name;
        const coordinates = result.location.coordinates;

        const memo = {
          title: result.name,
          memo: result.description,
          date: result.date,
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
      <Header id={currentUser.uid}></Header>

      <h1 className="text-blue-800 text-3xl mb-4">Lens</h1>
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />

      <Map locations={locations} />

      <div>
        {locations.map((location, locIndex) => (
          <div>
            {locations.map((location, locIndex) => (
              <table key={locIndex} className="w-full table-auto">
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
                  {location.memo.map((memo, memoIndex) => (
                    <tr key={memoIndex} className="bg-blue-100">
                      <td className="px-16 py-2 font-bold">{memo.title}</td>
                      <td className="px-16 py-2">{memo.memo}</td>
                      <td className="px-16 py-2">{memo.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lens;
