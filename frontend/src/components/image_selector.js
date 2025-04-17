import React, { useState, useRef, useEffect } from 'react';
import vexu_skills from '../images/vexu_skills.png';
import vexu_game from '../images/vexu_game.png';
import './image_selector.css';
import { convertPixelsToFeet } from '../helpers/conversions';
import CodeBlocks from './code_blocks';
import Knob from "./knob";

function ImageComponent() {
    const [currentImage, setCurrentImage] = useState(vexu_skills);
    const [points, setPoints] = useState([]);
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [editingPointId, setEditingPointId] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState({});

    const actualImageRef = useRef(null);
    const mouseDownPosition = useRef(null);

    const handleSkillsClick = () => {
        setCurrentImage(vexu_skills);
    };

    const handleGameClick = () => {
        setCurrentImage(vexu_game);
    };

    const handleMouseDown = (event) => {
        event.preventDefault();
        const rect = actualImageRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        mouseDownPosition.current = { x, y };
    };

    const handleMouseUp = (event) => {
        event.preventDefault();
        const rect = actualImageRef.current.getBoundingClientRect();

        // Compute pixel coords relative to actual image
        const x_px = Math.min(Math.max(0, event.clientX - rect.left), rect.width);
        const y_px = Math.min(Math.max(0, event.clientY - rect.top), rect.height);
        const distance = mouseDownPosition.current
            ? Math.hypot(mouseDownPosition.current.x - x_px, mouseDownPosition.current.y - y_px)
            : 0;

        if (distance < 5) {
            // Check existing point
            const clickedPoint = points.find(pt => Math.hypot(pt.x - x_px, pt.y - y_px) < 15);
            if (clickedPoint) {
                toggleDropdown(clickedPoint.id);
                mouseDownPosition.current = null;
                return;
            }
            // Convert to feet
            const { x_pos: x_ft, y_pos: y_ft } = convertPixelsToFeet(x_px, y_px, 'bottom_left', rect);
            const newPoint = {
                id: Date.now(),
                x: x_px,
                y: y_px,
                x_ft,
                y_ft,
                angle: 0,
                label: `Point ${points.length + 1}`
            };
            setPoints(prev => [...prev, newPoint]);
            toggleDropdown(newPoint.id);
        }
        mouseDownPosition.current = null;
    };

    const handleDragStart = (pointId, event) => {
        event.preventDefault();
        let startX = event.clientX;
        let startY = event.clientY;
        const dragHandler = e => {
            e.preventDefault();
            const rect = actualImageRef.current.getBoundingClientRect();
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            setPoints(prev => prev.map(pt => {
                if (pt.id !== pointId) return pt;
                // compute new pixel
                const newX = Math.min(Math.max(0, pt.x + deltaX), rect.width);
                const newY = Math.min(Math.max(0, pt.y + deltaY), rect.height);
                // convert to feet
                const { x_pos: x_ft, y_pos: y_ft } = convertPixelsToFeet(newX, newY, 'bottom_left', rect);
                startX = e.clientX;
                startY = e.clientY;
                return {...pt, x: newX, y: newY, x_ft, y_ft};
            }));
        };
        const stopDrag = () => {
            window.removeEventListener('mousemove', dragHandler);
            window.removeEventListener('mouseup', stopDrag);
        };
        window.addEventListener('mousemove', dragHandler);
        window.addEventListener('mouseup', stopDrag);
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
    };

    const handleDeletePoint = (id) => {
        setPoints((prevPoints) => prevPoints.filter((point) => point.id !== id));
    };

    const handleCreateNewPoint = () => {
        const newPoint = {
            id: Date.now(),
            x: 50,
            y: 50,
            angle: 0,
            x_ft: 0,
            y_ft: 0,
            label: `Point ${points.length + 1}`,
        };
        setPoints((prevPoints) => [...prevPoints, newPoint]);
        toggleDropdown(newPoint.id); // Open the new point's dropdown immediately
    };

    const toggleDropdown = (pointId) => {
        setIsDropdownOpen(prevState => ({
            ...prevState,
            [pointId]: !prevState[pointId]
        }));
    };

    const handleInputChange = (id, field, value) => {
        const rect = actualImageRef.current.getBoundingClientRect();
        const fieldSizeFt = 12; // field size in feet
      
        setPoints(prev =>
          prev.map(point => {
            if (point.id !== id) return point;
            let updated = { ...point };
      
            if (field === 'x_ft') {
              updated.x_ft = value;
              // convert feet to px horizontally
              updated.x = (value / fieldSizeFt) * rect.width;
            } else if (field === 'y_ft') {
              updated.y_ft = value;
              // origin is bottom_left: invert Y
              updated.y = rect.height - (value / fieldSizeFt) * rect.height;
            } else if (field === 'label') {
              updated.label = value;
            }
            return updated;
          })
        );
      };

    const handleAngleChange = (id, newAngle) => {
        setPoints(prevPoints =>
            prevPoints.map(point =>
                point.id === id ? { ...point, angle: newAngle } : point
            )
        );
    };

    return (
        <div className="image-container">
            <div className='main-content'>
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
                                <div className="dropdown">
                                    <button
                                        className="dropdown-button"
                                        onClick={() => toggleDropdown(point.id)}
                                    >
                                        {point.label}
                                    </button>
                                    {isDropdownOpen[point.id] && (
                                        <div className="dropdown-content">
                                            <input
                                                type="text"
                                                placeholder="Label"
                                                value={point.label}
                                                onChange={(e) => handleInputChange(point.id, 'label', e.target.value)}
                                                style={{ display: 'block', marginBottom: '5px' }}
                                            />
                                            <input
                                                type="number"
                                                placeholder="X (ft)"
                                                value={point.x_ft}
                                                onChange={(e) => handleInputChange(point.id, 'x_ft', parseFloat(e.target.value) || 0)}
                                                style={{ display: 'block', marginBottom: '5px' }}
                                            />
                                            <input
                                                type="number"
                                                placeholder="Y (ft)"
                                                value={point.y_ft}
                                                onChange={(e) => handleInputChange(point.id, 'y_ft', parseFloat(e.target.value) || 0)}
                                                style={{ display: 'block', marginBottom: '5px' }}
                                            />
                                            <Knob
                                                id={`knob-${point.id}`}
                                                size={75}
                                                showText={true}
                                                angle={point.angle}
                                                onAngleChange={(id, angle) => {
                                                    handleAngleChange(point.id, angle);
                                                }}
                                            />
                                            <div style={{ marginTop: '5px' }}>
                                                <button
                                                    onClick={() => {
                                                        toggleDropdown(point.id); // Close the dropdown
                                                    }}
                                                >
                                                    Close
                                                </button>
                                                <button onClick={() => handleDeletePoint(point.id)}>Delete</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Main Content */}
                <div className="image-wrapper">
                    <div className="actual-image-container"  onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
                        {/* Main Image */}
                        <img
                            ref={actualImageRef}
                            src={currentImage}
                            alt="VEXU Image"
                            className="centered-image"
                            draggable="false"
                        />

                        {points.map((point) => (
                            <div key={point.id} style={{ position: 'absolute', left: `${point.x}px`, top: `${point.y}px` }} className="draggable-point" onMouseDown={(e) => handleDragStart(point.id, e)}>
                                <Knob
                                    id={`field-knob-${point.id}`}
                                    size={30}
                                    showText={false}
                                    angle={point.angle}
                                    onAngleChange={(id, angle) => {
                                        handleAngleChange(point.id, angle);
                                    }}
                                />
                                <div className="point-label">
                                    {point.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Buttons for Switching Images */}
                <div className="button-container">
                    <button onClick={handleSkillsClick}>Skills Field</button>
                    <button onClick={handleGameClick}>Game Field</button>
                </div>
            </div>

            {/* Code Blocks Component */}
            <div className="code-blocks-component">
                <CodeBlocks x_ft={points.length? points[points.length-1].x_ft:0}
                            y_ft={points.length? points[points.length-1].y_ft:0}
                            speed="fast_motion" />
            </div>
        </div>
    );
}

export default ImageComponent;
