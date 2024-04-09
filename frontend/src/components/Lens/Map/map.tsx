import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

interface Location {
  coordinates: [number, number];
  memo: {
    description: string;
    title: string;
    date: string;
    location: string;
  }[];
}

interface MapProps {
  locations: Location[];
  view: string;
}

const ChangeView = ({ center }) => {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
};

const Map: React.FC<MapProps> = ({ locations, view }) => {
  const center: [number, number] =
    locations.length > 0 ? locations[0].coordinates : [49.27326489299744, -123.10365200042726];
  const zoom = view === "map" ? 10 : 13;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "500px", width: "100%", borderRadius: "10px" }}
    >
      <ChangeView center={center} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((location, index) => (
        <Marker key={index} position={location.coordinates}>
          <Popup>
            {location.memo.map((memo, memoIndex) => (
              <div key={`${index}-${memoIndex}`}>
                <p>{memo.title}</p>
                <p>{memo.description}</p>
              </div>
            ))}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
