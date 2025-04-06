import React, { useState, useRef } from 'react';
import vexu_skills from '../images/vexu_skills.png';
import vexu_game from '../images/vexu_game.png';
import './image_selector.css';
import { convertPixelsToFeet } from '../helpers/conversions';
import CodeBlocks from './code_blocks';

function ImageComponent() {
    const [currentImage, setCurrentImage] = useState(vexu_skills); // Start with skills image
    const [points, setPoints] = useState([]); // Track all points
    const [selectedPoint, setSelectedPoint] = useState(null); // Track the currently selected point
    const [editingPointId, setEditingPointId] = useState(null); // Track the point being edited
    const imageRef = useRef(null);
    const mouseDownPosition = useRef(null); // Track the initial mouse position on mousedown

    const handleSkillsClick = () => {
        setCurrentImage(vexu_skills);
    };

    const handleGameClick = () => {
        setCurrentImage(vexu_game);
    };

    const handleMouseDown = (event) => {
        event.preventDefault(); // Prevent text selection during drag
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
        event.preventDefault(); // Prevent text selection during drag
        let startX = event.clientX;
        let startY = event.clientY;

        const dragHandler = (dragEvent) => {
            dragEvent.preventDefault(); // Prevent text selection during drag

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

    const handleEditPoint = (id) => {
        setEditingPointId(id); // Set the point being edited
    };

    const handleSaveEdit = (id, label, x, y, angle) => {
        setPoints((prevPoints) =>
            prevPoints.map((point) =>
                point.id === id
                    ? {
                        ...point,
                        label,
                        x: parseFloat(x),
                        y: parseFloat(y),
                        angle: parseFloat(angle),
                    }
                    : point
            )
        );
        setEditingPointId(null); // Exit edit mode
    };

    const handleDeletePoint = (id) => {
        setPoints((prevPoints) => prevPoints.filter((point) => point.id !== id));
        setSelectedPoint(null); // Deselect the point if it was selected
    };

    const handleCreateNewPoint = () => {
        const newPoint = {
            id: Date.now(),
            x: 50, // Default position
            y: 50,
            angle: 0,
            x_ft: 0,
            y_ft: 0,
            label: `Point ${points.length + 1}`,
        };
        setPoints((prevPoints) => [...prevPoints, newPoint]);
    };

    return (
        <div className="image-container">
            <div className="side-menu">
                <h3>Points</h3>
                <button onClick={handleCreateNewPoint} style={{ marginBottom: '10px' }}>
                    Create New Point
                </button>
                {points.length === 0 ? (
                    <p>No points created yet.</p>
                ) : (
                    points.map((point) => (
                        <div key={point.id} style={{ marginBottom: '10px' }}>
                            {editingPointId === point.id ? (
                                <div>
                                    <input
                                        type="text"
                                        defaultValue={point.label}
                                        placeholder="Label"
                                        style={{ display: 'block', marginBottom: '5px' }}
                                        ref={(input) => (window[`labelInput-${point.id}`] = input)}
                                    />
                                    <input
                                        type="number"
                                        defaultValue={point.x}
                                        placeholder="X Position"
                                        style={{ display: 'block', marginBottom: '5px' }}
                                        ref={(input) => (window[`xInput-${point.id}`] = input)}
                                    />
                                    <input
                                        type="number"
                                        defaultValue={point.y}
                                        placeholder="Y Position"
                                        style={{ display: 'block', marginBottom: '5px' }}
                                        ref={(input) => (window[`yInput-${point.id}`] = input)}
                                    />
                                    <input
                                        type="number"
                                        defaultValue={point.angle}
                                        placeholder="Angle"
                                        style={{ display: 'block', marginBottom: '5px' }}
                                        ref={(input) => (window[`angle-${point.id}`] = input)}
                                    />
                                    <button
                                        onClick={() =>
                                            handleSaveEdit(
                                                point.id,
                                                window[`labelInput-${point.id}`].value,
                                                window[`xInput-${point.id}`].value,
                                                window[`yInput-${point.id}`].value,
                                                window[`angle-${point.id}`].value
                                            )
                                        }
                                    >
                                        Save
                                    </button>
                                    <button onClick={() => setEditingPointId(null)}>Cancel</button>
                                </div>
                            ) : (
                                <div>
                                    <strong>{point.label}</strong>
                                    <p>X: {point.x.toFixed(1)}, Y: {point.y.toFixed(1)}, Angle: {point.angle.toFixed(1)}</p>
                                    <button onClick={() => handleEditPoint(point.id)}>Edit</button>
                                    <button onClick={() => handleDeletePoint(point.id)}>Delete</button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Main Content */}
            <div
                className="image-wrapper"
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
                />

                {/* Render Points */}
                {points.map((point) => (
                    <div key={point.id} style={{ position: 'absolute', left: `${point.x}px`, top: `${point.y}px` }}>
                        {/* Point Circle */}
                        <div
                            className="draggable-point"
                            onMouseDown={(e) => handleDragStart(point.id, e)}
                        ></div>

                        {/* Angle Indicator Bar */}
                        <div
                            className="angle-indicator-bar"
                            style={{
                                transform: `rotate(${point.angle}deg)`, // Rotate the bar based on the angle
                            }}
                        ></div>

                        {/* Point Label */}
                        <div className="point-label">
                            {point.label}
                        </div>
                    </div>
                ))}

                {/* Popup Menu for Selected Point */}
                {selectedPoint && (
                    <div
                        className="popup-menu"
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
            <div className="code-blocks-component">
                <CodeBlocks x_ft={0} y_ft={0} speed="fast_motion" />
                {/* Side Menu */}
            </div>
        </div>
    );
}

export default ImageComponent;