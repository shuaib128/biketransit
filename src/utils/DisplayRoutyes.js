import Polyline from "ol/format/Polyline";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { Style, Stroke } from "ol/style";

async function getRoute(fromLat, fromLon, toLat, toLon, date, time) {
    const baseUrl = "http://localhost:8080/otp/routers/default/plan";
    const query = new URLSearchParams({
        fromPlace: `${fromLat},${fromLon}`,
        toPlace: `${toLat},${toLon}`,
        mode: "BICYCLE,TRANSIT",
        date: date, // format: "MM-DD-YYYY"
        time: time, // format: "HH:mm:ss" (24-hour format)
    });

    try {
        const response = await fetch(`${baseUrl}?${query}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.plan.itineraries[1];
    } catch (error) {
        console.error("Error fetching the route:", error);
        return null; // or you could return an error message or some error code
    }
}

export const displayRoute = async (
    map,
    fromLat,
    fromLon,
    toLat,
    toLon,
    date,
    time
) => {
    const route = await getRoute(fromLat, fromLon, toLat, toLon, date, time);

    if (route) {
        route.legs.forEach((leg) => {
            const legGeometry = new Polyline().readGeometry(
                leg.legGeometry.points,
                {
                    dataProjection: "EPSG:4326",
                    featureProjection: map.getView().getProjection(),
                }
            );

            const feature = new Feature({
                geometry: legGeometry,
                type: leg.mode,
            });

            let color;
            switch (leg.mode) {
                case "BICYCLE":
                    color = "#0000FF"; // Blue for bicycle segments
                    break;
                case "BUS":
                case "TRAM":
                case "RAIL":
                    color = "#FF0000"; // Red for transit segments
                    break;
                default:
                    color = "#00FF00"; // Some other color for different modes (WALK)
            }

            const style = new Style({
                stroke: new Stroke({
                    color: color,
                    width: 6,
                }),
            });

            feature.setStyle(style);

            const vectorSource = new VectorSource({
                features: [feature],
            });

            const vectorLayer = new VectorLayer({
                source: vectorSource,
            });

            map.addLayer(vectorLayer);
        });
    }
};
