import { useState } from "react";
import LocationItem from "../LocationItem/LocationItem";

const LocationList = (props:{ 
  locations:{}, 
  handleDeleteMemo:(memo:any,event:React.MouseEvent<HTMLButtonElement, MouseEvent>) => void, 
  }) => {
    const [expandedLocations, setExpandedLocations] = useState({});
    const handleLocationClick = (locationName) => {
      setExpandedLocations({
        ...expandedLocations,
        [locationName]: !expandedLocations[locationName],
      });
    };
  return (
    <div>
      <h2 className="text-blue-800 text-lg">Locations</h2>
      {Object.keys(props.locations).map((locationName) => (
        <LocationItem
          key={locationName}
          locationName={locationName}
          expanded={expandedLocations[locationName]}
          handleLocationClick={handleLocationClick}
          memos={props.locations[locationName]}
          handleDeleteMemo={props.handleDeleteMemo}
         />
      ))}
    </div>
  );
};

export default LocationList;
