import { BackendLink } from "./BackLink";

export async function getRoutes(fromLat, fromLon, toLat, toLon, date, time) {
    const baseUrl = BackendLink + "/otp/routers/default/plan";
    const query = new URLSearchParams({
        fromPlace: `${fromLat},${fromLon}`,
        toPlace: `${toLat},${toLon}`,
        mode: "BICYCLE,TRANSIT",
        date: date, // format: "MM-DD-YYYY"
        time: time, // format: "HH:mm:ss" (24-hour format)
    });

    try {
        const response = await fetch(`${baseUrl}?${query}`);
        console.log(response);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.plan.itineraries;
    } catch (error) {
        console.error("Error fetching the route:", error);
        return null; // or you could return an error message or some error code
    }
}
