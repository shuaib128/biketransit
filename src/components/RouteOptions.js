import React from "react";
import {
    Box,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from "@chakra-ui/react";
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
            <Accordion>
                {[...Routes]
                    .sort((a, b) => a.duration - b.duration)
                    .map((route, index) => (
                        <AccordionItem key={index} sx={{ padding: "5px 0px" }}>
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
                                            {transformTime(route.startTime)}—
                                            {transformTime(route.endTime)}
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
                                    markDirectionHandler={markDirectionHandler}
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
                        </AccordionItem>
                    ))}
            </Accordion>
        </Box>
    );
};

export default RouteOptions;
