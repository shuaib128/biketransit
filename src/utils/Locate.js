import View from "ol/View";
import { fromLonLat } from "ol/proj";

// Function to center map on user's location
export const locate = (map) => {
    if (!map) return Promise.reject("Map instance is not available");

    // Return a new Promise
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = [
                        position.coords.longitude,
                        position.coords.latitude,
                    ];
                    const olCoords = fromLonLat(coords); // Convert to OpenLayers coordinate system
                    map.setView(
                        new View({
                            center: olCoords,
                            zoom: 13, // Closer zoom to see the location clearly
                        })
                    );

                    resolve(olCoords); // Resolve the promise with the coordinates
                },
                (error) => {
                    reject("Geolocation error: " + error.message); // Reject the promise on error
                }
            );
        } else {
            reject("Geolocation is not supported by your browser."); // Reject if Geolocation is not supported
        }
    });
};
