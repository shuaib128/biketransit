import React, { useState, useEffect } from "react";

const DelayedInput = ({ onTypingEnd, placeHolder, value, setValue }) => {
    const [typingTimeout, setTypingTimeout] = useState(null);

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setValue(newValue);

        // Clear the previous timeout, if there is one
        if (typingTimeout) clearTimeout(typingTimeout);

        // Set a new timeout
        const newTimeout = setTimeout(() => {
            onTypingEnd(newValue);
        }, 1000);

        setTypingTimeout(newTimeout);
    };

    useEffect(() => {
        // Cleanup timeout on component unmount
        return () => {
            if (typingTimeout) clearTimeout(typingTimeout);
        };
    }, [typingTimeout]);

    return (
        <input
            style={{
                padding: "10px 15px",
                borderRadius: "8px",
                zIndex: "1",
                width: "85%",
                height: "48px",
            }}
            type="text"
            placeholder={placeHolder}
            value={value}
            onChange={handleInputChange}
        />
    );
};

export default DelayedInput;
