import React from "react";
import { Box } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { MdDirectionsBike } from "react-icons/md";
import { IoMdBus } from "react-icons/io";
import { MdTram } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa6";

const RouteSumarry = ({ index, Legs, markDirectionHandler }) => {
    const Trnasit = ({
        Headsign = "",
        Mode,
        RouteColor = "DC143C",
        HeaderTxtColor = "FFFFFF",
    }) => {
        return (
            <Box style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                {Mode === "BICYCLE" ? (
                    <Icon as={MdDirectionsBike} />
                ) : Mode === "TRAM" ? (
                    <Icon as={MdTram} />
                ) : (
                    <Icon as={IoMdBus} />
                )}
                {Headsign !== "" ? (
                    <p
                        style={{
                            backgroundColor: "#" + RouteColor,
                            color: "#" + HeaderTxtColor,
                            padding: "2px 5px",
                            borderRadius: "5px",
                            fontSize: "13px",
                        }}
                    >
                        {Headsign}
                    </p>
                ) : (
                    <dvi></dvi>
                )}
            </Box>
        );
    };

    return (
        <Box
            onClick={() => markDirectionHandler(Legs)}
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                justifyContent: "left",
                flexWrap: "wrap",
                width: "100%",
                height: "100%"
            }}
        >
            {Legs.map((leg, index) => {
                return (
                    <React.Fragment key={index}>
                        <Trnasit
                            key={index}
                            Headsign={leg.routeShortName}
                            Mode={leg.mode}
                            RouteColor={leg.routeColor}
                            HeaderTxtColor={leg.routeTextColor}
                        />

                        {index < Legs.length - 1 && (
                            <Icon
                                fontSize="12px"
                                color="gray"
                                as={FaAngleRight}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </Box>
    );
};

export default RouteSumarry;
