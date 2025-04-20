import React, { useState, useRef, useEffect } from 'react';
import vexu_skills from '../images/vexu_skills.png';
import vexu_game from '../images/vexu_game.png';
import './image_selector.css';
import { convertPixelsToFeet } from '../helpers/conversions';
import CodeBlocks from './code_blocks';
import Knob from "./knob";

function ImageComponent() {
    const [currentImage, setCurrentImage] = useState(vexu_skills);
    // Paths each containing a list of points
    const [paths, setPaths] = useState([]);
    const [selectedPathId, setSelectedPathId] = useState(null);
    const [isPathDropdownOpen, setIsPathDropdownOpen] = useState({});
    const [isPointDropdownOpen, setIsPointDropdownOpen] = useState({});

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

        if (distance < 5 && selectedPathId !== null) { // Ensure a path is selected
            // Check existing point
            const clickedPoint = paths.flatMap(p => p.points).find(pt => Math.hypot(pt.x - x_px, pt.y - y_px) < 15);
            if (clickedPoint) {
                togglePointDropdown(clickedPoint.pathId, clickedPoint.id);
                mouseDownPosition.current = null;
                return;
            }

            // Find path index and next point index for labeling
            const pathIndex = paths.findIndex(p => p.id === selectedPathId);
            const targetPath = paths.find(p => p.id === selectedPathId);
            const pointIndex = targetPath ? targetPath.points.length : 0;
            const newLabel = `(${pathIndex + 1}, ${pointIndex + 1})`;

            // Convert to feet
            const { x_pos: x_ft, y_pos: y_ft } = convertPixelsToFeet(x_px, y_px, 'bottom_left', rect);
            const newPoint = {
                id: Date.now(),
                pathId: selectedPathId,
                x: x_px,
                y: y_px,
                x_ft,
                y_ft,
                angle: 0,
                label: newLabel // Use the generated label
            };
            setPaths(prev => prev.map(p => p.id === selectedPathId ? { ...p, points: [...p.points, newPoint] } : p));
            togglePointDropdown(selectedPathId, newPoint.id);
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
            setPaths(prev => prev.map(p => ({
                ...p,
                points: p.points.map(pt => {
                    if (pt.id !== pointId) return pt;
                    // compute new pixel
                    const newX = Math.min(Math.max(0, pt.x + deltaX), rect.width);
                    const newY = Math.min(Math.max(0, pt.y + deltaY), rect.height);
                    // convert to feet
                    const { x_pos: x_ft, y_pos: y_ft } = convertPixelsToFeet(newX, newY, 'bottom_left', rect);
                    startX = e.clientX;
                    startY = e.clientY;
                    return {...pt, x: newX, y: newY, x_ft, y_ft};
                })
            })));
        };
        const stopDrag = () => {
            window.removeEventListener('mousemove', dragHandler);
            window.removeEventListener('mouseup', stopDrag);
        };
        window.addEventListener('mousemove', dragHandler);
        window.addEventListener('mouseup', stopDrag);
    };

    const handleSaveEdit = (id, label, x, y, angle) => {
        setPaths(prevPaths =>
            prevPaths.map(path => ({
                ...path,
                points: path.points.map(point =>
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
            }))
        );
    };

    const handleDeletePoint = (pathId, pointId) => {
        setPaths(prevPaths =>
            prevPaths.map(path =>
                path.id === pathId
                    ? { ...path, points: path.points.filter(point => point.id !== pointId) }
                    : path
            )
        );
    };

    const handleCreateNewPath = () => {
        const newPath = { id: Date.now(), label: `Path ${paths.length + 1}`, points: [] };
        setPaths(prev => [...prev, newPath]);
        setSelectedPathId(newPath.id);
        togglePathDropdown(newPath.id);
    };

    const handleCreatePointInPath = (pathId) => {
        // Find path index and next point index for labeling
        const pathIndex = paths.findIndex(p => p.id === pathId);
        const targetPath = paths.find(p => p.id === pathId);
        const pointIndex = targetPath ? targetPath.points.length : 0;
        const newLabel = `(${pathIndex + 1}, ${pointIndex + 1})`;

        const newPoint = { id: Date.now(), pathId, x: 50, y: 50, x_ft: 0, y_ft: 0, angle: 0, label: newLabel }; // Use the generated label
        setPaths(prev => prev.map(p => p.id === pathId ? { ...p, points: [...p.points, newPoint] } : p));
        togglePointDropdown(pathId, newPoint.id);
    };

    const togglePathDropdown = (pathId) => {
        setIsPathDropdownOpen(prev => ({ ...prev, [pathId]: !prev[pathId] }));
    };

    const togglePointDropdown = (pathId, pointId) => {
        const key = `${pathId}-${pointId}`;
        setIsPointDropdownOpen(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleInputChange = (pathId, pointId, field, value) => {
        const rect = actualImageRef.current.getBoundingClientRect();
        const fieldSizeFt = 12; // field size in feet
      
        setPaths(prev =>
          prev.map(path => ({
            ...path,
            points: path.points.map(point => {
              if (point.id !== pointId) return point;
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
          }))
        );
      };

    const handleAngleChange = (pathId, pointId, newAngle) => {
        setPaths(prevPaths =>
            prevPaths.map(path => ({
                ...path,
                points: path.points.map(point =>
                    point.id === pointId ? { ...point, angle: newAngle } : point
                )
            }))
        );
    };

    return (
        <div className="image-container">
            <div className='main-content'>
                <div className="side-menu">
                    <h3>Paths</h3>
                    <button onClick={handleCreateNewPath} style={{ marginBottom: '10px' }}>
                        Create New Path
                    </button>
                    {paths.length === 0 ? (
                        <p>No paths created yet.</p>
                    ) : (
                        paths.map((path) => (
                            <div key={path.id} style={{ marginBottom: '10px' }}>
                                <div className="dropdown">
                                    <button
                                        className="dropdown-button"
                                        onClick={() => togglePathDropdown(path.id)}
                                    >
                                        {path.label}
                                    </button>
                                    {isPathDropdownOpen[path.id] && (
                                        <div className="dropdown-content">
                                            <button
                                                onClick={() => handleCreatePointInPath(path.id)}
                                                style={{ marginBottom: '10px' }}
                                            >
                                                Create New Point
                                            </button>
                                            {path.points.length === 0 ? (
                                                <p>No points created yet.</p>
                                            ) : (
                                                path.points.map((point) => (
                                                    <div key={point.id} style={{ marginBottom: '10px' }}>
                                                        <div className="dropdown">
                                                            <button
                                                                className="dropdown-button"
                                                                onClick={() => togglePointDropdown(path.id, point.id)}
                                                            >
                                                                {point.label}
                                                            </button>
                                                            {isPointDropdownOpen[`${path.id}-${point.id}`] && (
                                                                <div className="dropdown-content">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Label"
                                                                        value={point.label}
                                                                        onChange={(e) => handleInputChange(path.id, point.id, 'label', e.target.value)}
                                                                        style={{ display: 'block', marginBottom: '5px' }}
                                                                    />
                                                                    <input
                                                                        type="number"
                                                                        placeholder="X (ft)"
                                                                        value={point.x_ft}
                                                                        onChange={(e) => handleInputChange(path.id, point.id, 'x_ft', parseFloat(e.target.value) || 0)}
                                                                        style={{ display: 'block', marginBottom: '5px' }}
                                                                    />
                                                                    <input
                                                                        type="number"
                                                                        placeholder="Y (ft)"
                                                                        value={point.y_ft}
                                                                        onChange={(e) => handleInputChange(path.id, point.id, 'y_ft', parseFloat(e.target.value) || 0)}
                                                                        style={{ display: 'block', marginBottom: '5px' }}
                                                                    />
                                                                    <Knob
                                                                        id={`knob-${point.id}`}
                                                                        size={75}
                                                                        showText={true}
                                                                        angle={point.angle}
                                                                        onAngleChange={(id, angle) => {
                                                                            handleAngleChange(path.id, point.id, angle);
                                                                        }}
                                                                    />
                                                                    <div style={{ marginTop: '5px' }}>
                                                                        <button
                                                                            onClick={() => {
                                                                                togglePointDropdown(path.id, point.id); // Close the dropdown
                                                                            }}
                                                                        >
                                                                            Close
                                                                        </button>
                                                                        <button onClick={() => handleDeletePoint(path.id, point.id)}>Delete</button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
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

                        {paths.flatMap(p => p.points).map((point) => (
                            <div 
                                key={point.id} 
                                style={{ 
                                    position: 'absolute', 
                                    left: `${point.x}px`, 
                                    top: `${point.y}px`, 
                                    transform: 'translate(-50%, -50%)' // Center the div itself
                                }}
                                className="draggable-point" 
                                onMouseDown={(e) => handleDragStart(point.id, e)}
                            >
                                <Knob
                                    id={`field-knob-${point.id}`}
                                    size={30} // Keep the Knob size
                                    showText={false}
                                    angle={point.angle}
                                    onAngleChange={(id, angle) => {
                                        handleAngleChange(point.pathId, point.id, angle);
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
                {/* Simplified props to test for syntax errors */}
                <CodeBlocks x_ft={0}
                            y_ft={0}
                            speed="fast_motion" />
            </div>
        </div>
    );
}

export default ImageComponent;
