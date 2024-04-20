import React from "react";
import {
    Box,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Icon,
} from "@chakra-ui/react";
import { MdDirectionsBike } from "react-icons/md";
import RouteSumarry from "./RouteSumarry";
import RouteDetail from "./RouteDetail";

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

const RouteOptions = ({ Routes, markDirectionHandler }) => {
    return (
        <Box
            sx={{
                textAlign: "left",
                backgroundColor: "white",
                padding: "0px 0px",
                borderRadius: "8px",
                height: "55vh",
                overflowY: "scroll",
                scrollbarWidth: "10px",
            }}
        >
            <Accordion allowMultiple>
                {[...Routes]
                    .sort((a, b) => a.duration - b.duration)
                    .map((route, index) => {
                        //Calculate the fare
                        let fare;
                        if (
                            route &&
                            route.fare &&
                            route.fare.fare &&
                            route.fare.fare.regular &&
                            route.fare.fare.regular.cents
                        ) {
                            fare = (
                                route.fare.fare.regular.cents / 100
                            ).toFixed(2);
                        } else {
                            console.error("One of the properties is undefined");
                            // Handle the error appropriately, possibly assigning a default value
                            fare = "0.00";
                        }

                        // Calculate the total bike time
                        let bikingDuration = 0;
                        route.legs.forEach((leg) => {
                            if (leg.mode === "BICYCLE") {
                                bikingDuration += leg.duration;
                            }
                        });

                        return (
                            <AccordionItem
                                key={index}
                                sx={{ padding: "5px 0px" }}
                            >
                                <h2>
                                    <AccordionButton pb={1}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                cursor: "pointer",
                                            }}
                                            as="span"
                                            flex="1"
                                            textAlign="left"
                                        >
                                            <p style={{ fontWeight: "600" }}>
                                                {transformTime(route.startTime)}
                                                —{transformTime(route.endTime)}
                                            </p>

                                            <p style={{ fontWeight: "600" }}>
                                                {formatDuration(route.duration)}
                                            </p>
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                </h2>

                                <Box sx={{ padding: "0px 17px", pb: "10px" }}>
                                    <RouteSumarry
                                        index={index}
                                        Legs={route.legs}
                                        markDirectionHandler={
                                            markDirectionHandler
                                        }
                                    />
                                </Box>

                                <AccordionPanel
                                    pb={4}
                                    pt={0}
                                    height="350px"
                                    overflowY="scroll"
                                >
                                    <RouteDetail Legs={route.legs} />
                                </AccordionPanel>

                                <Box
                                    style={{
                                        marginLeft: "20px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "13px",
                                    }}
                                >
                                    <p>${fare}</p>

                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Icon
                                            marginRight="5px"
                                            as={MdDirectionsBike}
                                        />
                                        <p style={{ alignItems: "center" }}>
                                            {formatDuration(bikingDuration)}
                                        </p>
                                    </div>
                                </Box>
                            </AccordionItem>
                        );
                    })}
            </Accordion>
        </Box>
    );
};

export default RouteOptions;
