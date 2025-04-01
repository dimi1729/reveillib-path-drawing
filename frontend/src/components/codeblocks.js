import React, { useState, useRef, useEffect } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css"; // Import a theme for syntax highlighting
import "prismjs/components/prism-cpp"; // Import the C++ language definition

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
    if (range && editorRef.current) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  // Apply syntax highlighting
  useEffect(() => {
    if (editorRef.current) {
      // Clear existing content to avoid duplication
      editorRef.current.innerHTML = "";

      // Create a highlighted HTML string using Prism.js
      const highlightedCode = Prism.highlight(
        code,
        Prism.languages.cpp, // Use the C++ language definition
        "cpp" // Specify the language
      );

      // Insert the highlighted code into the contentEditable div
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = highlightedCode;

      // Append each child node of the highlighted code to the editor
      Array.from(tempDiv.childNodes).forEach((node) => {
        editorRef.current.appendChild(node.cloneNode(true));
      });

      // Restore the cursor position
      const range = saveCursorPosition();
      setTimeout(() => restoreCursorPosition(range), 0);
    }
  }, [code]);

  // Handle input changes
  const handleInput = () => {
    const range = saveCursorPosition(); // Save the cursor position
    const newCode = editorRef.current.innerText; // Get the updated content
    setCode(newCode); // Update the state with the new content
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

  return (
    <div style={styles.container}>
      <h2>C++ Code Editor</h2>
      <div
        ref={editorRef}
        style={styles.codeBlock}
        contentEditable={true}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning={true}
      ></div>
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
};

export default CPPCodeEditor;