import React from "react";
import { markSearchedLocation } from "../utils/MarkSearchedLocation";

const LocationSuggetions = ({ Map, Locations, setLocations }) => {
    const locationClickHandler = (map, lon, lat) => {
        markSearchedLocation(map, lon, lat);
        setLocations([])
    };

    return (
        <div
            style={{
                textAlign: "left",
                backgroundColor: "white",
                padding: "10px 20px",
            }}
        >
            <ul style={{ padding: 0 }}>
                {Locations.map((location) => {
                    console.log(location);
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
