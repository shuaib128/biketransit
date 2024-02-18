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
import { MdMyLocation } from "react-icons/md";

const OpenLayersMap = () => {
    const [map, setmap] = useState(null);
    const mapRef = useRef(null);

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
        locate(map).then((olCoords) => {
            pinpoint(map, olCoords);
        });

        // Cleanup on component unmount
        return () => map.setTarget(undefined);
    }, []);

    const locateAndPinpoint = () => {
        // Find the user location and then pin point them
        locate(map).then((olCoords) => {
            pinpoint(map, olCoords);
        });
    };

    return (
        <div>
            <div ref={mapRef} style={{ width: "100%", height: "100vh" }}></div>
            <IconButton
                style={{
                    marginTop: "10px",
                    position: "fixed",
                    bottom: 20,
                    right: 15,
                    padding: "5px",
                    borderRadius: "8px",
                    cursor: "pointer"
                }}
                size='lg'
                fontSize='20px'
                onClick={locateAndPinpoint}
                colorScheme="blue"
                aria-label="Search database"
                icon={<Icon as={MdMyLocation} />}
            />
        </div>
    );
};

export default OpenLayersMap;
