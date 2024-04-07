// @ts-nocheck
import React, { useState, useEffect } from "react";
import { UserController } from "../../../../controllers/user.controller";
import { MemoController } from "../../../../controllers/memo.controller";
const SavedLocations = ({
  id,
  reloadDropdown,
  onDropdownReloaded,
  onLocationSelected,
}) => {
  const [savedLocations, setSavedLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [memos, setMemos] = useState({});

  const fetchData = async () => {
    try {
      const data = await UserController.get_user_data(id);
      fetchMemos(data.memos);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchMemos = async (memoID) => {
    try {
      const fetchedMemos: { [key: string]: MemoType } = {};
      const fetchedLocations: { [key: string]: [number, number] } = {};
      var locations: any[] = [{ name: "past locations" }];
      for (const mid of memoID) {
        const data = await MemoController.get_memo(id, mid);
        fetchedMemos[mid] = data;
        fetchedLocations[data.location.name] = data.location.coordinates;
        locations.push({
          name: data.location.name,
          coordinates: data.location.coordinates,
        });
      }
      setMemos((prevMemos) => ({ ...prevMemos, ...fetchedMemos }));
      setSavedLocations(locations);
    } catch (error) {
      console.error("Error fetching memos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, reloadDropdown, onDropdownReloaded]);

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    const selectedLocation = savedLocations.find(
      (location) => location.name === selectedValue
    );

    if (selectedLocation) {
      const coordinates = selectedLocation.coordinates;
      setSelectedLocation(coordinates);
      // Pass the selected location coordinates to the parent component
      onLocationSelected(coordinates);
    }
  };

  return (
    <div>
      <label htmlFor="savedLocations">Saved Locations:</label>
      <select
        id="savedLocations"
        value={selectedLocation}
        onChange={handleSelectChange}
      >
        {savedLocations.map((location, index) => (
          <option key={index} value={location.name}>
            {location.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SavedLocations;
