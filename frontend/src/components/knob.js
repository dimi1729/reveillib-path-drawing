import React, { useEffect, useRef, useState } from "react";
import "./knob.css";

const Knob = ({ id, size = 80, showText = true, onAngleChange, angle: externalAngle }) => {
    const [angle, setAngle] = useState(externalAngle ?? null); // Allow null as the initial value
    const [isDragging, setIsDragging] = useState(false); // Dragging state
    const containerRef = useRef(null);
    const knobRef = useRef(null);

    // Function to calculate angle from mouse position
    const getAngle = (x, y) => {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = x - centerX;
        const deltaY = y - centerY;
        let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        angle = 360 - angle; // Reverse direction
        if (angle < 0) angle += 360;
        return angle;
    };

    // Function to update the knob's position based on the current angle
    const updateKnobPosition = (newAngle) => {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const radius = rect.width / 2;

        // Use 0° if newAngle is null
        const angleToUse = newAngle ?? 0;

        const radians = angleToUse * (Math.PI / 180);
        const knobX = Math.cos(radians) * radius;
        const knobY = Math.sin(radians) * radius;

        if (knobRef.current) {
            knobRef.current.style.left = `${centerX + knobX}px`;
            knobRef.current.style.top = `${centerY - knobY}px`;
        }
    };

    // Update the knob's position when the component initializes or externalAngle changes
    useEffect(() => {
        updateKnobPosition(externalAngle ?? 0); // Ensure position is set during initialization
    }, [externalAngle]);

    useEffect(() => {
        const container = containerRef.current;
        const knob = knobRef.current;

        if (!container || !knob) return;

        // Mouse down event: Start dragging
        const handleMouseDown = (e) => {
            setIsDragging(true);
            const newAngle = getAngle(e.clientX, e.clientY);
            updateKnob(newAngle);
        };

        // Mouse move event: Update angle while dragging
        const handleMouseMove = (e) => {
            if (isDragging) {
                const newAngle = getAngle(e.clientX, e.clientY);
                updateKnob(newAngle);
            }
        };

        // Mouse up event: Stop dragging
        const handleMouseUp = () => {
            setIsDragging(false);
        };

        // Add event listeners
        knob.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        // Cleanup event listeners
        return () => {
            knob.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging]);

    // Update knob position and notify parent of angle change
    const updateKnob = (newAngle) => {
        let angleProc = Math.round(newAngle * 10) / 10; // Fixed precision to 1 decimal place
        if (angleProc >= 360) angleProc -= 360;

        setAngle(angleProc);

        // Update the knob's visual position
        updateKnobPosition(angleProc);

        // Notify parent of angle change
        if (onAngleChange) {
            onAngleChange(id, angleProc);
        }
    };

    // Handle input change for manual entry of angles
    const handleInputChange = (e) => {
        if (e.target.value === "") {
            setAngle(null); // Set to null when input is empty
            updateKnobPosition(null); // Reset position to default (0°)
            if (onAngleChange) onAngleChange(id, null); // Notify parent of null value
            return;
        }

        const inputAngle = parseFloat(e.target.value);

        if (!isNaN(inputAngle)) {
            let newAngle = inputAngle % 360; // Keep within bounds of 0-359°
            if (newAngle < 0) newAngle += 360; // Handle negative angles

            newAngle = Math.round(newAngle * 10) / 10; // Limit to 1 decimal place

            setAngle(newAngle);

            // Update the knob's visual position
            updateKnobPosition(newAngle);

            // Notify parent of angle change
            if (onAngleChange) {
                onAngleChange(id, newAngle);
            }
        }
    };

    return (
        <div
            className="knob-container"
            ref={containerRef}
            style={{ width: size, height: size }}
        >
            <div
                className="knob"
                ref={knobRef}
                style={{
                    width: `${size * 0.3}px`,
                    height: `${size * 0.3}px`,
                }}
            ></div>
            {showText && (
                <input
                    className="angle-display"
                    type="text"
                    value={angle !== null ? angle.toFixed(1) : ""} // Display with 1 decimal place
                    onChange={handleInputChange}
                />
            )}
        </div>
    );
};

export default Knob;
