import { useState, useEffect } from "react";
import { MemoController } from "../../../../controllers/memo.controller";
import { useFirebaseAuth } from "../../../../contexts/FirebaseAuth.context";

// FIXME -- the entire component function, remove `//@ts-nocheck` and fix issues
const SavedLocations = (props: {
  reloadDropdown: boolean;
  onDropdownReloaded: () => void;
  onLocationSelected: (string) => void;
}) => {
  const [savedLocations, setSavedLocations] = useState<
    [{ name: string; coordinates: [number, number] }]
  >([{ name: "", coordinates: [0, 0] }]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const { currentUser } = useFirebaseAuth();

  const fetchData = async () => {
    try {
      var locations: [{name:string,coordinates:[number,number]}] = [{ name: "Choose a saved location: ",coordinates:[0,0] }];
      const memoData = await MemoController.get_all_memos(currentUser.uid);
      if (memoData) {
        for (const memo in memoData) {
          const existingIndex = locations.findIndex(
            (location) => location.name === memoData[memo].location.name
          );
          if (existingIndex === -1) {
            locations.push({
              name: memoData[memo].location.name,
              coordinates: memoData[memo].location.coordinates,
            });
          }
        }
      }
      setSavedLocations(locations);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [props.reloadDropdown, props.onDropdownReloaded]);

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    const selectedLocation = savedLocations.find(
      (location) => location.name === selectedValue
    );
    if (selectedLocation) {
      const coordinates = selectedLocation.coordinates;
      setSelectedLocation(selectedLocation.name);
      // Pass the selected location coordinates to the parent component
      props.onLocationSelected(coordinates);
    }
  };

  return (
    <div>
      <label htmlFor="savedLocations" className="text-sky-800">Saved Locations:</label>
      <select
        id="savedLocations"
        value={selectedLocation}
        onChange={handleSelectChange} className="bg-white p-2"
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
