import React, { useEffect, useRef, useState } from "react";
import "./knob.css";

const Knob = ({ id, size = 80, showText = true, onAngleChange, angle: externalAngle }) => {
    const [angle, setAngle] = useState(externalAngle || 0); // Current angle of the knob
    const [isDragging, setIsDragging] = useState(false); // Dragging state
    const containerRef = useRef(null);
    const knobRef = useRef(null);

    // Function to calculate angle from mouse position
    const getAngle = (x, y) => {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = x - centerX;
        const deltaY = -y + centerY;
        let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        if (angle < 0) angle += 360;
        return angle;
    };

    // Function to update the knob's position based on the current angle
    const updateKnobPosition = (newAngle) => {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const radius = rect.width / 2;

        const radians = newAngle * (Math.PI / 180);
        const knobX = Math.cos(radians) * radius;
        const knobY = Math.sin(radians) * radius;

        if (knobRef.current) {
            knobRef.current.style.left = `${centerX - rect.left + knobX}px`;
            knobRef.current.style.top = `${centerY - rect.top + knobY}px`;
        }
    };

    // Update the knob's position when the angle changes
    useEffect(() => {
        if (externalAngle !== undefined && externalAngle !== angle) {
            setAngle(externalAngle);
            updateKnobPosition(externalAngle);
        }
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
    }, [isDragging, size, id, onAngleChange]);

    // Update knob position and notify parent of angle change
    const updateKnob = (newAngle) => {
        let angleProc = Math.round((360 - newAngle) * 10) / 10;
        angleProc = angleProc >= 360 ? angleProc - 360 : angleProc;
        setAngle(angleProc);

        // Update the knob's visual position
        updateKnobPosition(angleProc);

        // Notify parent of angle change
        if (onAngleChange) {
            onAngleChange(id, angleProc);
        }
    };

    // Handle input change
    const handleInputChange = (e) => {
        if (e.target.value === "") {
            return;
        }
        const inputAngle = parseFloat(e.target.value);
        if (!isNaN(inputAngle)) {
            const multiplier = Math.pow(10, 1); // Fixed precision of 1 decimal place
            const newAngle = (inputAngle * multiplier) % (360 * multiplier) / multiplier;
            const finalAngle = newAngle >= 360 ? newAngle - 360 : newAngle;
            setAngle(finalAngle);

            // Update the knob's visual position
            updateKnobPosition(finalAngle);

            // Notify parent of angle change
            if (onAngleChange) {
                onAngleChange(id, finalAngle);
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
                    value={angle}
                    onChange={handleInputChange}
                />
            )}
        </div>
    );
};

export default Knob;