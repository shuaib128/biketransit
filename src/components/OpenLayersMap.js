import React, { useState, useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { locate } from "../utils/Locate";
import { pinpoint } from "../utils/LocationMarker";
import { IconButton } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { MdMyLocation, MdDirections } from "react-icons/md";
import { displayRoute } from "../utils/DisplayRoutyes";
import { locationSuggetionSearch } from "../utils/LocationSuggetionSearch";
import DelayedInput from "./DelayedInput";
import LocationSuggetions from "./LocationSuggetions";

const OpenLayersMap = () => {
    const [map, setmap] = useState(null);
    const [Locations, setLocations] = useState([]);
    const [EnableDirectionSearch, setEnableDirectionSearch] = useState(false);
    const mapRef = useRef(null);

    const handleTypingEnd = (value) => {
        locationSuggetionSearch(map, value).then((locations) => {
            setLocations(locations);
        });
    };

    useEffect(() => {
        // Initialize the map with a dummy view, will update once location is fetched
        const map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            view: new View({
                center: [0, 0], // Will be updated
                zoom: 2, // Initial zoom level
            }),
        });
        setmap(map); // Update the map state with the const map

        // Find the user location and then pin point them
        locate(map)
            .then((olCoords) => {
                pinpoint(map, olCoords);
            })
            .catch((error) => {
                console.error(error);
                // Handle the error appropriately
            });

        //Mark the direction
        displayRoute(
            map,
            47.797338428730924,
            -122.32163127361333,
            47.891412588577715,
            -122.28512357546042,
            "03-04-2024",
            "21:00:00"
        );
        // Cleanup on component unmount
        return () => map.setTarget(undefined);
    }, []);

    const locateAndPinpoint = () => {
        // Find the user location and then pin point them
        locate(map)
            .then((olCoords) => {
                pinpoint(map, olCoords);
            })
            .catch((error) => {
                console.error(error);
                // Handle the error appropriately
            });
    };

    return (
        <div>
            <div
                style={{
                    marginTop: "10px",
                    position: "fixed",
                    top: -1,
                    left: 40,
                    borderRadius: "8px",
                    zIndex: "1",
                    width: "300px",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "5px",
                }}
            >
                <DelayedInput
                    onTypingEnd={handleTypingEnd}
                    placeHolder={
                        !EnableDirectionSearch
                            ? "Search Locations"
                            : "Start point"
                    }
                />

                <IconButton
                    style={{
                        marginTop: "0px",
                        padding: "5px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        width: "15%",
                    }}
                    size="lg"
                    fontSize="25px"
                    onClick={locateAndPinpoint}
                    colorScheme="blue"
                    aria-label="Search database"
                    icon={<Icon as={MdDirections} />}
                    onClickCapture={() =>
                        setEnableDirectionSearch(!EnableDirectionSearch)
                    }
                />
            </div>

            {EnableDirectionSearch ? (
                <div
                    style={{
                        marginTop: "10px",
                        position: "fixed",
                        top: 48,
                        left: 35,
                        borderRadius: "8px",
                        zIndex: "1",
                        width: "300px"
                    }}
                >
                    <DelayedInput
                        onTypingEnd={handleTypingEnd}
                        placeHolder="Search Destination"
                    />
                </div>
            ) : (
                <div></div>
            )}
            <div
                style={{
                    marginTop: "10px",
                    position: "fixed",
                    top: 52,
                    left: 40,
                    borderRadius: "8px",
                    width: "333px",
                    zIndex: "1",
                }}
            >
                {Locations.length ? (
                    <LocationSuggetions
                        Map={map}
                        Locations={Locations}
                        setLocations={setLocations}
                    />
                ) : (
                    <div></div>
                )}
            </div>
            <div ref={mapRef} style={{ width: "100%", height: "100vh" }}></div>
            <IconButton
                style={{
                    marginTop: "10px",
                    position: "fixed",
                    bottom: 20,
                    right: 15,
                    padding: "5px",
                    borderRadius: "8px",
                    cursor: "pointer",
                }}
                size="lg"
                fontSize="20px"
                onClick={locateAndPinpoint}
                colorScheme="blue"
                aria-label="Search database"
                icon={<Icon as={MdMyLocation} />}
            />
        </div>
    );
};

export default OpenLayersMap;
