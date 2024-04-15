import React from "react";
import { Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

const LocationSkeleton = () => {
    return (
        <div style={{marginTop: "20px"}}>
            <Skeleton borderRadius="5px" height="60px" />
            <SkeletonText borderRadius="5px" />
            <Skeleton borderRadius="5px" mt="20px" height="200px" />
        </div>
    );
};

export default LocationSkeleton;
