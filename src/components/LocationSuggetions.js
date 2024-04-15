import React from "react";
import { markSearchedLocation } from "../utils/MarkSearchedLocation";

const LocationSuggetions = ({
    Map,
    setLocation,
    setLocationDisplayName,
    Locations,
    setLocations,
    DirectionSearchEnabled,
}) => {
    const locationClickHandler = (map, location, lon, lat) => {
        setLocation(location);
        setLocationDisplayName(location.display_name)
        
        if (!DirectionSearchEnabled) {
            markSearchedLocation(map, lon, lat);
        }

        setLocations([]);
    };

    return (
        <div
            style={{
                textAlign: "left",
                backgroundColor: "white",
                padding: "10px 20px",
                borderRadius: "8px",
            }}
        >
            <ul style={{ padding: 0 }}>
                {Locations.map((location) => {
                    return (
                        <li
                            key={location.place_id}
                            style={{
                                listStyle: "none",
                                borderBottom: "1px solid #d2d1d1",
                                marginBottom: "10px",
                                paddingBottom: "10px",
                                cursor: "pointer",
                            }}
                            onClick={() =>
                                locationClickHandler(
                                    Map,
                                    location,
                                    location.lon,
                                    location.lat
                                )
                            }
                        >
                            {location.display_name}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default LocationSuggetions;
