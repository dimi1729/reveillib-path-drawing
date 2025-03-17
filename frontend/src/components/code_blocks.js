import React from 'react';
import './code_blocks.css';

function CodeBlocks({ text }) {
  return (
    <div className="code-blocks-container">
      <pre className="code-block code-block-content">
        {"// ADD COMMENTS HERE"}
      </pre>
      <pre className="code-block code-block-content">
        {text}
      </pre>
      <pre className="code-block code-block-content">
        {"reckless->await()"}
      </pre>
    </div>
  );
}

export default CodeBlocks;