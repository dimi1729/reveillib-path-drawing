import React, { useState, useRef } from "react";

const CPPCodeEditor = () => {
  const [code, setCode] = useState(`#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}`);
  const editorRef = useRef(null);

  // Save the current cursor position
  const saveCursorPosition = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      return selection.getRangeAt(0);
    }
    return null;
  };

  // Restore the cursor position
  const restoreCursorPosition = (range) => {
    if (range) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  // Handle input changes
  const handleInput = (event) => {
    const range = saveCursorPosition(); // Save the cursor position
    setCode(event.target.innerText); // Update the state with the new content
    setTimeout(() => restoreCursorPosition(range), 0); // Restore the cursor position after React updates the DOM
  };

  // Handle keydown events (e.g., Tab)
  const handleKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault(); // Prevent default tab behavior (focus change)

      const selection = window.getSelection();
      const range = selection.getRangeAt(0);

      // Insert 4 spaces for the Tab key
      const tabNode = document.createTextNode("    ");
      range.deleteContents(); // Clear the current selection (if any)
      range.insertNode(tabNode);

      // Move the cursor after the inserted tab
      range.setStartAfter(tabNode);
      range.setEndAfter(tabNode);
      selection.removeAllRanges();
      selection.addRange(range);

      // Update the state with the new content
      setCode(editorRef.current.innerText);
    }
  };

  // Change the code programmatically
  const changeCode = () => {
    const range = saveCursorPosition(); // Save the cursor position
    setCode(`#include <iostream>\n\nint main() {\n    std::cout << "Code changed!" << std::endl;\n    return 0;\n}`);
    setTimeout(() => restoreCursorPosition(range), 0); // Restore the cursor position after React updates the DOM
  };

  return (
    <div style={styles.container}>
      <h2>C++ Code Editor</h2>
      <button onClick={changeCode} style={styles.button}>
        Change Code
      </button>
      <div
        ref={editorRef}
        style={styles.codeBlock}
        contentEditable={true}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning={true}
      >
        {code}
      </div>
    </div>
  );
};

// Styling for the component
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    margin: "20px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    maxWidth: "800px",
  },
  codeBlock: {
    margin: 0,
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#2d2d2d",
    color: "#f8f8f2",
    fontFamily: "monospace",
    fontSize: "14px",
    whiteSpace: "pre-wrap",
    overflowX: "auto",
    minHeight: "150px",
  },
  button: {
    marginBottom: "10px",
    padding: "10px 20px",
    fontSize: "14px",
    cursor: "pointer",
    borderRadius: "4px",
    border: "1px solid #ccc",
    backgroundColor: "#007bff",
    color: "#fff",
  },
};

export default CPPCodeEditor;