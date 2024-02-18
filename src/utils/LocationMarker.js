import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Style, Icon } from "ol/style";
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';

export const pinpoint = (map, coords) => {
    if (!map) return; // Ensure the map instance is available
    // Add a marker at the user's location
    const locationMarker = new Feature({
        geometry: new Point(coords),
    });

    const markerStyle = new Style({
        image: new Icon({
            anchor: [0.5, 46],
            anchorXUnits: "fraction",
            anchorYUnits: "pixels",
            src: "https://openlayers.org/en/latest/examples/data/icon.png", // Example marker icon
        }),
    });

    locationMarker.setStyle(markerStyle);

    const vectorSource = new VectorSource({
        features: [locationMarker],
    });

    const vectorLayer = new VectorLayer({
        source: vectorSource,
    });

    map.addLayer(vectorLayer);
};
