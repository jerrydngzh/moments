// @ts-nocheck
import React, { useState, useEffect } from "react";
import Map from "./map";
import { Link } from "react-router-dom";
import { UserController } from "../../controllers/user.controller";
import { MemoController } from "../../controllers/memo.controller";
import Header from "../Header/header";

interface Location {
  coordinates: [number, number];
  memo: { memo: string; selectedCategories: string[] }[];
}

const Lens: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [userID, setUserID] = useState("");
  const [userData, setUserData] = useState({});
  const [memos, setMemos] = useState({});

  const fetchData = async () => {
    try {
      // NOTE: search for userID in path as query variable
      const searchParams = new URLSearchParams(window.location.search);
      const idFromQuery = searchParams.get("id") || "";
      setUserID(idFromQuery);

      const userData = await UserController.get_user_data(idFromQuery);
      setUserData(userData);

      console.log("Memos: ", userData.memos);
      // memos is an array of memo IDs :: string
      fetchMemos(userData.memos);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchMemos = async (memoID: any) => {
    try {
      const fetchedLocations: Location[] = [];
      const searchParams = new URLSearchParams(window.location.search);
      const idFromQuery = searchParams.get("id") || "";
      setUserID(idFromQuery);
      console.log("user: ", idFromQuery); // right now userid shows up as empty, need to fix this

      for (const mid of memoID) {
        // FIXME
        // const response = await fetch(`http://localhost:3000/api/memos/${userID}/${mid}`);
        // const memoData = await response.json();
        const result = await MemoController.get_memo(idFromQuery, mid);

        const locationName = result.location.name;
        const coordinates = result.location.coordinates;
        const memo = {
          title: result.name,
          memo: result.description,
          date: result.date,
        };

        // Check if location already exists in fetchedLocations array
        const existingLocationIndex = fetchedLocations.findIndex(
          (loc) =>
            loc.coordinates[0] === coordinates[0] &&
            loc.coordinates[1] === coordinates[1]
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
    fetchData();
    console.log(locations);
  }, []);

  return (
    <div className="lens w-2/3 text-left m-auto mt-10 bg-blue-200 p-10 pr-20 pl-20 rounded-3xl border-2 border-blue-800">
      <Header id={userID}></Header>

      <h1 className="text-blue-800 text-3xl mb-4">Lens</h1>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet/dist/leaflet.css"
      />
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
