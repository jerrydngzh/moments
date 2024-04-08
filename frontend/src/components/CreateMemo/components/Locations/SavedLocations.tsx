//@ts-nocheck
import { useState, useEffect } from "react";
import { MemoController } from "../../../../controllers/memo.controller";
import { MemoType } from "../../../../models/memo";

// FIXME -- the entire component function, remove `//@ts-nocheck` and fix issues
const SavedLocations = ({ id, reloadDropdown, onDropdownReloaded, onLocationSelected }) => {
  const [savedLocations, setSavedLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");

  const fetchData = async () => {
    try {
      var locations: any[] = [{ name: "past locations" }];
      const memoData = await MemoController.get_all_memos(id);
      if(memoData){
        console.log(memoData);
        for(const memo in memoData){
          locations.push({
            name: memos[memo].location.name,
            coordinates: memos[memo].location.coordinates,
          });
        }
      }
      setSavedLocations(locations);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, reloadDropdown, onDropdownReloaded]);

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    const selectedLocation = savedLocations.find((location) => location.name === selectedValue);
    if (selectedLocation) {
      const coordinates = selectedLocation.coordinates;
      setSelectedLocation(selectedLocation.name);
      // Pass the selected location coordinates to the parent component
      onLocationSelected(coordinates);
    }
  };

  return (
    <div>
      <label htmlFor="savedLocations">Saved Locations:</label>
      <select id="savedLocations" value={selectedLocation} onChange={handleSelectChange}>
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
