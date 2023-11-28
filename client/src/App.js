import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Store cursor positions
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    // Connect to WebSocket server
    const socket = new WebSocket('ws://localhost:8765'); // WebSocket server address

    // Listen for messages from the server
    socket.onmessage = (event) => {
      // Data is in the format: x,y
      const data = event.data.split(",");
      if (data.length === 2) {
        // Convert string to float
        const x = parseFloat(data[0]);
        const y = parseFloat(data[1]);
        // Convert percentage to position on screen
        const width = window.innerWidth;
        const height = window.innerHeight;
        const posX = x * width;
        const posY = y * height;
        // Store position in state array 
        setPositions(() => [{ x: posX, y: posY }]);
      }
    };

    // Track mouse movements and send cursor positions to the python server
    document.addEventListener('mousemove', (event) => {
      // Get mouse position
      const x = event.clientX;
      const y = event.clientY;
      
      // Convert position to percentage of screen
      const width = window.innerWidth;
      const height = window.innerHeight;
      const percentX = x / width;
      const percentY = y / height;

      // Send position to server if connection is open
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(`${percentX},${percentY}`);
      }
    });

    return () => {
      // Disconnect from WebSocket server when component unmounts
      socket.close();
    };
  }, []);

  return (
    <div className="App">
      <h1>Cursor Tracker</h1>
      <div className="cursor-container">
        {positions.map((position, index) => (
          <div
            key={index}
            className="cursor"
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default App;
