import View from "ol/View";
import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Icon, Style } from "ol/style";

export const markSearchedLocation = async (map, lon, lat) => {
    const coords = fromLonLat([lon, lat]);
    let markerLayer = map
        .getLayers()
        .getArray()
        .find((layer) => layer.get("id") === "searchMarker");

    if (!markerLayer) {
        // Create layer if it does not exist
        markerLayer = new VectorLayer({ source: new VectorSource() });
        markerLayer.set("id", "searchMarker");
        map.addLayer(markerLayer);
    }

    // Add marker for the searched location
    const marker = new Feature(new Point(coords));
    marker.setStyle(
        new Style({
            image: new Icon({
                src: "/images/icons/destination-location.png",
                anchor: [0.5, 1],
            }),
        })
    );

    markerLayer.getSource().clear(); // Clear previous features
    markerLayer.getSource().addFeature(marker); // Add new feature

    // Set map view to the searched location
    map.setView(new View({ center: coords, zoom: 18 }));
};
