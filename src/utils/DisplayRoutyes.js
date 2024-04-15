import Polyline from "ol/format/Polyline";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { Style, Stroke } from "ol/style";
import Point from "ol/geom/Point";
import { Fill, Circle, Text } from "ol/style";

function createMarker(lat, lon, color, text) {
    const pointGeom = new Point([lon, lat]).transform("EPSG:4326", "EPSG:3857");
    const markerFeature = new Feature(pointGeom);

    // Directly create and set the style for the feature
    const markerStyle = new Style({
        image: new Circle({
            radius: 7,
            fill: new Fill({ color: color }), // Ensure this color is applied
        }),
        text: new Text({
            text: text,
            offsetY: -15,
            fill: new Fill({ color: "#000" }),
            font: "14px Arial",
        }),
    });

    // Set the style on the feature
    markerFeature.setStyle(markerStyle);

    return markerFeature;
}

// Global variable to hold the current direction layer
let directionLayer = null;

export const displayRoute = async (
    Legs,
    map,
    fromLat,
    fromLon,
    toLat,
    toLon
) => {
    // Remove the existing direction layer if it exists
    if (directionLayer) {
        map.removeLayer(directionLayer);
        directionLayer = null;
    }

    if (Legs) {
        const features = [];
        // Add start and destination markers
        const startMarker = createMarker(fromLat, fromLon, "green", "Start");
        const destinationMarker = createMarker(toLat, toLon, "red", "End");
        features.push(startMarker, destinationMarker);

        Legs.forEach((leg) => {
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
            let dashed;
            switch (leg.mode) {
                case "BICYCLE":
                    color = "#0000FF";
                    dashed = [3, 9];
                    break;
                case "BUS":
                    color = leg.routeColor ? "#" + leg.routeColor : "#dc143c";
                    dashed = [0, 0];
                    break;
                case "TRAM":
                    color = leg.routeColor ? "#" + leg.routeColor : "#dc143c";
                    dashed = [0, 0];
                    break;
                case "RAIL":
                    color = leg.routeColor ? "#" + leg.routeColor : "#dc143c";
                    dashed = [0, 0];
                    break;
                default:
                    dashed = [0, 0];
                    color = "#00FF00"; // Some other color for different modes (e.g., WALK)
            }

            const style = new Style({
                stroke: new Stroke({
                    color: color,
                    width: 6,
                    lineDash: dashed,
                }),
            });

            feature.setStyle(style);
            features.push(feature);
        });

        const vectorSource = new VectorSource({
            features: features,
        });

        directionLayer = new VectorLayer({
            source: vectorSource,
        });

        map.addLayer(directionLayer);
    }
};
