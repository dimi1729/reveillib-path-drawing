import React, { useState } from 'react';
import vexu_skills from '../images/vexu_skills.png';
import vexu_game from '../images/vexu_game.png';
import './image_selector.css';
import { convertPixelsToFeet } from '../helpers/conversions'
import CodeBlocks from './code_blocks'

function ImageComponent() {
  const [currentImage, setCurrentImage] = useState(vexu_skills); // Start with skills image

  const handleSkillsClick = () => {
      setCurrentImage(vexu_skills);
  };

  const handleGameClick = () => {
      setCurrentImage(vexu_game);
  };

const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

const handleImageClick = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Calculate the position relative to the image
    const xPos = Math.round(x);
    const yPos = Math.round(y);

    const pos_ft = convertPixelsToFeet(xPos, yPos, "bottom_left")
    
    setClickPosition({ x: pos_ft.x_pos, y: pos_ft.y_pos });
    console.log(`Clicked at position: x=${xPos}, y=${yPos}`);
};

return (
    <div className="image-container">
        <div className="image-wrapper" style={{ position: 'relative' }}>
            <img 
                src={currentImage} 
                alt="VEXU Image" 
                className="centered-image" 
                onClick={handleImageClick}
            />
            <div>
                <CodeBlocks text={`Clicked Position: x=${clickPosition.x}, y=${clickPosition.y}`} />
            </div>
        </div>
        <div className="button-container">
            <button onClick={handleSkillsClick}>Skills Field</button>
            <button onClick={handleGameClick}>Game Field</button>
        </div>
    </div>
);
}

export default ImageComponent;
