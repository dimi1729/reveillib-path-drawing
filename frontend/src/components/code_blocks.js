import React from 'react';
import './code_blocks.css';
import { codeGenerator } from '../helpers/code_generator'

function CodeBlocks({ x_ft, y_ft, speed }) {

  console.log(`x feet is ${x_ft}`)
  console.log(`y feet is ${y_ft}`)
  console.log(`speed is ${speed}`)

  return (
    <div className="code-blocks-container">
      <pre className="code-block code-block-content">
        {"// ADD COMMENTS HERE"}
      </pre>
      <pre className="code-block code-block-content">
        {codeGenerator(x_ft, y_ft, speed)}
      </pre>
      <pre className="code-block code-block-content">
        {"reckless->await();"}
      </pre>
    </div>
  );
}

export default CodeBlocks;