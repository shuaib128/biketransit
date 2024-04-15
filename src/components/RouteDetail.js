import React from "react";
import { Box, Alert } from "@chakra-ui/react";

const RouteDetail = ({ Legs }) => {
    const transformTime = (timestamp) => {
        const date = new Date(timestamp);
        const options = { hour: "numeric", minute: "numeric", hour12: true };
        const timeString = date.toLocaleTimeString("en-US", options);

        return timeString;
    };

    function formatDuration(durationSeconds) {
        const minutes = Math.floor(durationSeconds / 60);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours > 0 ? hours + " h " : ""}${remainingMinutes} min`;
    }

    function formatDistance(distanceMeters) {
        let meters_to_miles = 1 / 1609.34;
        let distance_miles = distanceMeters * meters_to_miles;

        return distance_miles.toFixed(1);
    }

    const Trnasit = ({
        Headsign = "",
        BusName = "",
        RouteColor = "DC143C",
        HeaderTxtColor = "FFFFFF",
    }) => {
        return (
            <Box style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                {Headsign !== "" ? (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignContent: "stretch",
                            justifyContent: "space-evenly",
                            alignItems: "baseline",
                        }}
                    >
                        <p
                            style={{
                                backgroundColor: "#" + RouteColor,
                                color: "#" + HeaderTxtColor,
                                padding: "2px 5px",
                                borderRadius: "5px",
                                fontSize: "12px",
                            }}
                        >
                            {Headsign}
                        </p>
                        <p>{BusName}</p>
                    </div>
                ) : (
                    <dvi></dvi>
                )}
            </Box>
        );
    };

    return (
        <>
            {Legs.map((leg, index) => {
                return (
                    <div
                        style={{
                            marginTop: index !== 0 ? "60px" : "20px",
                            width: "100%",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <div style={{ width: "30%" }}>
                                <p>{transformTime(leg.startTime)}</p>
                            </div>

                            <div style={{ width: "70%" }}>
                                <p
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: "17px",
                                    }}
                                >
                                    {leg.from.name}
                                </p>
                                <Trnasit
                                    key={index}
                                    Headsign={leg.routeShortName}
                                    BusName={leg.routeLongName}
                                    Mode={leg.mode}
                                    RouteColor={leg.routeColor}
                                    HeaderTxtColor={leg.routeTextColor}
                                />

                                <div style={{ marginTop: "15px" }}>
                                    <Alert
                                        status="success"
                                        padding="5px 10px"
                                        borderRadius="5px"
                                        fontSize="13px"
                                        width="fit-content"
                                    >
                                        {leg.mode}{" "}
                                        {formatDuration(leg.duration)} for{" "}
                                        {formatDistance(leg.distance)} mi
                                    </Alert>
                                </div>
                            </div>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: "8px",
                            }}
                        >
                            <div style={{ width: "30%" }}>
                                <p>{transformTime(leg.endTime)}</p>
                            </div>

                            <div style={{ width: "70%" }}>
                                <p
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: "17px",
                                    }}
                                >
                                    {leg.to.name}
                                </p>
                                <Trnasit
                                    key={index}
                                    Headsign={leg.routeShortName}
                                    Mode={leg.mode}
                                    RouteColor={leg.routeColor}
                                    HeaderTxtColor={leg.routeTextColor}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default RouteDetail;
