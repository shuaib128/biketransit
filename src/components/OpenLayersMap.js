import React, { useState, useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { locate } from "../utils/Locate";
import { pinpoint } from "../utils/LocationMarker";
import { IconButton, Button } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { MdMyLocation, MdDirections } from "react-icons/md";
import { locationSuggetionSearch } from "../utils/LocationSuggetionSearch";
import DelayedInput from "./DelayedInput";
import LocationSuggetions from "./LocationSuggetions";
import { getRoutes } from "../utils/GetRoutes";
import RouteOptions from "./RouteOptions";
import { displayRoute } from "../utils/DisplayRoutyes";
import LocationSkeleton from "../utils/skeletion/LocationSkeleton";
import RouteSkeletion from "../utils/skeletion/RouteSkeletion";

const OpenLayersMap = () => {
    const [map, setmap] = useState(null);
    const [Locations, setLocations] = useState([]);
    const [LocationsDestination, setLocationsDestination] = useState([]);
    const [StartLocation, setStartLocation] = useState({});
    const [StartLocationDisplayName, setStartLocationDisplayName] =
        useState("");
    const [DestinationLocation, setDestinationLocation] = useState({});
    const [DestinationLocationDisplayName, setDestinationLocationDisplayName] =
        useState("");
    const [EnableDirectionSearch, setEnableDirectionSearch] = useState(false);
    const [Routes, setRoutes] = useState([]);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [LoadingLocation, setLoadingLocation] = useState(false);
    const [LoadingRoutes, setLoadingRoutes] = useState(false);

    const handleDateChange = (e) => setDate(e.target.value);
    const handleTimeChange = (e) => setTime(e.target.value);
    const mapRef = useRef(null);

    //Handle when trying starting location
    const handleTypingEnd = (value) => {
        setLoadingLocation(true);

        setLocationsDestination([]);
        locationSuggetionSearch(map, value).then((locations) => {
            setLocations(locations);
            setLoadingLocation(false);
        });
    };

    //Handle when trying destination location
    const handleTypingEndDestination = (value) => {
        setLoadingLocation(true);

        setLocations([]);
        locationSuggetionSearch(map, value).then((locations) => {
            setLocationsDestination(locations);
            setLoadingLocation(false);
        });
    };

    function formatDate(dateString) {
        // Split the date into its components
        const parts = dateString.split("-"); // parts = ["2024", "03", "12"]
        // Rearrange the parts to get "MM-DD-YYYY"
        return `${parts[1]}-${parts[2]}-${parts[0]}`;
    }

    function formatTime(timeString) {
        // Append ":00" for the seconds
        return `${timeString}:00`;
    }

    useEffect(() => {
        // Check if both StartLocation and DestinationLocation have values
        if (
            Object.keys(StartLocation).length > 0 &&
            Object.keys(DestinationLocation).length > 0
        ) {
            //set loading for both start and direction suggestion to false;
            setLoadingLocation(false);
            setLoadingRoutes(true);

            getRoutes(
                StartLocation.lat,
                StartLocation.lon,
                DestinationLocation.lat,
                DestinationLocation.lon,
                formatDate(date),
                formatTime(time)
            ).then((routes) => {
                setRoutes(routes);
                setLoadingRoutes(false);
            });
        }
    }, [StartLocation, DestinationLocation, date, time]);

    useEffect(() => {
        console.log("haha");
        setRoutes([]);
        setLoadingRoutes(false);
    }, [StartLocationDisplayName, DestinationLocationDisplayName]);

    useEffect(() => {
        //initially all this fields should be empty if the map loads
        setLocations([]);
        setLocationsDestination([]);
        setStartLocation({});
        setDestinationLocation({});
        setRoutes([]);

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

        // Cleanup on component unmount
        return () => map.setTarget(undefined);
    }, [EnableDirectionSearch]);

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

    /**
     * Locate location as a destination
     */
    const locateAndSetAsStartDirrection = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Set latitude and longitude
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    setStartLocation({
                        lat: lat,
                        lon: lon,
                        display_name: "Your Location",
                    });
                },
                (error) => {
                    // Handle error
                }
            );
        } else {
        }
    };

    const handleMapClik = () => {
        //remove the startlocation and destination location
        setLocations([]);
        setLocationsDestination([]);

        //set loading for both start and direction suggestion to false;
        setLoadingLocation(false);
        setLoadingRoutes(false);
    };

    //Mark the direction
    /**
     * When a route was clicked from the RouteSummary it passes
     * the index of the route to the markDirection
     * function from the chield component. Using that we can now
     * display which route the user wants to see. Because route with
     * generate large number of routes
     */
    const markDirection = (Legs) => {
        displayRoute(
            Legs,
            map,
            StartLocation.lat,
            StartLocation.lon,
            DestinationLocation.lat,
            DestinationLocation.lon
        );
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
                    value={StartLocationDisplayName}
                    setValue={setStartLocationDisplayName}
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
                        position: "fixed",
                        top: 59,
                        left: 18,
                        borderRadius: "8px",
                        zIndex: "1",
                        width: "439px",
                        display: "flex",
                        alignItems: "end",
                    }}
                >
                    <div style={{ width: "70%" }}>
                        <Button
                            onClick={locateAndSetAsStartDirrection}
                            colorScheme="teal"
                            variant="link"
                            display="flex"
                            marginLeft="24px"
                            marginBottom="14px"
                        >
                            Your Location
                        </Button>
                        <DelayedInput
                            onTypingEnd={handleTypingEndDestination}
                            placeHolder="Search Destination"
                            value={DestinationLocationDisplayName}
                            setValue={setDestinationLocationDisplayName}
                        />
                    </div>

                    <div style={{ width: "30%" }}>
                        <input
                            type="date"
                            value={date}
                            onChange={handleDateChange}
                        />
                        <input
                            type="time"
                            value={time}
                            onChange={handleTimeChange}
                        />
                    </div>
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
                <>
                    {LoadingLocation ? (
                        <LocationSkeleton /> // Display this when locations are loading
                    ) : Locations.length ? (
                        <LocationSuggetions
                            Map={map}
                            setLocation={setStartLocation}
                            setLocationDisplayName={setStartLocationDisplayName}
                            Locations={Locations}
                            setLocations={setLocations}
                            DirectionSearchEnabled={EnableDirectionSearch}
                        />
                    ) : (
                        <div></div> // Display this when there are no locations and not loading
                    )}
                </>
            </div>

            <div
                style={{
                    marginTop: "10px",
                    position: "fixed",
                    top: 140,
                    left: 40,
                    borderRadius: "8px",
                    width: "333px",
                    zIndex: "1",
                }}
            >
                <>
                    {LocationsDestination.length ? (
                        <LocationSuggetions
                            Map={map}
                            setLocation={setDestinationLocation}
                            setLocationDisplayName={
                                setDestinationLocationDisplayName
                            }
                            Locations={LocationsDestination}
                            setLocations={setLocationsDestination}
                            DirectionSearchEnabled={EnableDirectionSearch}
                        />
                    ) : (
                        <div></div>
                    )}
                </>
            </div>

            <div
                style={{
                    marginTop: "10px",
                    position: "fixed",
                    top: 140,
                    left: 18,
                    borderRadius: "8px",
                    width: "350px",
                    zIndex: "1",
                }}
            >
                {LoadingRoutes ? (
                    <RouteSkeletion /> // Display this while loading
                ) : Routes.length ? (
                    <RouteOptions
                        Routes={Routes}
                        markDirectionHandler={markDirection}
                    />
                ) : (
                    <div></div> // Display this if there are no routes
                )}
            </div>

            <div
                onClick={() => handleMapClik()}
                ref={mapRef}
                style={{ width: "100%", height: "100vh" }}
            ></div>

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
