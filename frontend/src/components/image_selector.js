import React, { useState, useRef } from 'react';
import vexu_skills from '../images/vexu_skills.png';
import vexu_game from '../images/vexu_game.png';
import './image_selector.css';
import { convertPixelsToFeet } from '../helpers/conversions';
import CodeBlocks from './code_blocks';

function ImageComponent() {
    const [currentImage, setCurrentImage] = useState(vexu_skills); // Start with skills image
    const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
    const [points, setPoints] = useState([]); // Track all points
    const [selectedPoint, setSelectedPoint] = useState(null); // Track the currently selected point
    const imageRef = useRef(null);
    const mouseDownPosition = useRef(null); // Track the initial mouse position on mousedown

    const handleSkillsClick = () => {
        setCurrentImage(vexu_skills);
    };

    const handleGameClick = () => {
        setCurrentImage(vexu_game);
    };

    const handleMouseDown = (event) => {
        const rect = imageRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left; // Relative to the image
        const y = event.clientY - rect.top;

        // Store the initial mouse position
        mouseDownPosition.current = { x, y };
    };

    const handleMouseUp = (event) => {
        if (!mouseDownPosition.current) return;

        const rect = imageRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left; // Relative to the image
        const y = event.clientY - rect.top;

        // Calculate the distance between mouse down and mouse up positions
        const distance = Math.sqrt((mouseDownPosition.current.x - x) ** 2 + (mouseDownPosition.current.y - y) ** 2);

        // Only create a point if the distance is within a small threshold (e.g., 5px)
        if (distance < 5 && !selectedPoint) {
            // Check if the click is over an existing point
            const clickedPoint = points.find((point) => {
                const pointDistance = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);
                return pointDistance < 15; // Radius of the point is 15px
            });

            if (clickedPoint) {
                // Select the clicked point to show its menu
                setSelectedPoint(clickedPoint);
                console.log("Clicked on an existing point:", clickedPoint.label);
                mouseDownPosition.current = null; // Reset the mouse down position
                return;
            }

            // Convert pixel position to feet
            const pos_ft = convertPixelsToFeet(x, y, "bottom_left", rect);

            // Create a new point with a label
            const newPoint = {
                id: Date.now(), // Unique ID for each point
                x,
                y,
                angle: 0, // Default angle
                x_ft: pos_ft.x_pos,
                y_ft: pos_ft.y_pos,
                label: `Point ${points.length + 1}`, // Label for the point
            };

            // Add the new point to the state
            setPoints((prevPoints) => [...prevPoints, newPoint]);

            // Log the click position
            console.log(`Clicked at position: x=${x}, y=${y}`);
        }

        // Reset the mouse down position
        mouseDownPosition.current = null;
    };

    const handleDragStart = (pointId, event) => {
        let startX = event.clientX;
        let startY = event.clientY;

        const dragHandler = (dragEvent) => {
            // Calculate the delta (difference) between the current and previous mouse positions
            const deltaX = dragEvent.clientX - startX;
            const deltaY = dragEvent.clientY - startY;

            // Update the specific point's position
            setPoints((prevPoints) =>
                prevPoints.map((point) =>
                    point.id === pointId
                        ? {
                              ...point,
                              x: Math.max(0, point.x + deltaX), // Ensure it stays within bounds
                              y: Math.max(0, point.y + deltaY),
                          }
                        : point
                )
            );

            // Update the start positions for the next drag event
            startX = dragEvent.clientX;
            startY = dragEvent.clientY;
        };

        const stopDrag = () => {
            window.removeEventListener('mousemove', dragHandler);
            window.removeEventListener('mouseup', stopDrag);
        };

        // Attach event listeners for dragging
        window.addEventListener('mousemove', dragHandler);
        window.addEventListener('mouseup', stopDrag);
    };

    const closeMenu = (event) => {
        event.stopPropagation(); // Stop the event from propagating to the parent
        setSelectedPoint(null); // Close the popup menu
    };

    return (
        <div className="image-container">
            <div
                className="image-wrapper"
                style={{ position: 'relative' }}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
            >
                {/* Main Image */}
                <img
                    ref={imageRef}
                    src={currentImage}
                    alt="VEXU Image"
                    className="centered-image"
                    draggable="false"
                    style={{ pointerEvents: 'none' }}
                />

                {/* Render Points */}
                {points.map((point) => (
                    <div key={point.id} style={{ position: 'absolute', left: `${point.x}px`, top: `${point.y}px` }}>
                        {/* Point Circle */}
                        <div
                            className="draggable-point"
                            style={{
                                position: 'absolute',
                                left: '-7.5px', // Center the circle
                                top: '-7.5px',
                                width: '15px',
                                height: '15px',
                                backgroundColor: 'red',
                                borderRadius: '50%',
                                cursor: 'pointer',
                            }}
                            onMouseDown={(e) => handleDragStart(point.id, e)}
                        ></div>

                        {/* Point Label */}
                        <div
                            style={{
                                position: 'absolute',
                                left: '20px',
                                top: '-10px',
                                fontSize: '12px',
                                color: 'black',
                                whiteSpace: 'nowrap',
                                pointerEvents: 'none',
                            }}
                        >
                            {point.label}
                        </div>
                    </div>
                ))}

                {/* Popup Menu for Selected Point */}
                {selectedPoint && (
                    <div
                        className="popup-menu"
                        style={{
                            position: 'absolute',
                            left: `${selectedPoint.x + 20}px`,
                            top: `${selectedPoint.y}px`,
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            padding: '10px',
                            borderRadius: '5px',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                            zIndex: 1000,
                        }}
                        onClick={(e) => e.stopPropagation()} // Stop clicks inside the popup from propagating
                    >
                        <h3>{selectedPoint.label}</h3>
                        <p>X: {selectedPoint.x_ft.toFixed(1)} ft</p>
                        <p>Y: {selectedPoint.y_ft.toFixed(1)} ft</p>
                        <p>Angle: {selectedPoint.angle}°</p>
                        <button onClick={closeMenu}>Close</button>
                    </div>
                )}
            </div>

            {/* Buttons for Switching Images */}
            <div className="button-container">
                <button onClick={handleSkillsClick}>Skills Field</button>
                <button onClick={handleGameClick}>Game Field</button>
            </div>

            {/* Code Blocks Component */}
            <div>
                <CodeBlocks x_ft={clickPosition.x} y_ft={clickPosition.y} speed="fast_motion" />
            </div>
        </div>
    );
}

export default ImageComponent;