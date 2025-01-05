import React, { useState, useEffect } from 'react';

// Grid Cell Component - Now with responsive sizing
const RainCell = ({ cell, size }) => (
  <div
    style={{
      width: size,
      height: size,
      backgroundColor: cell.active ? cell.color : "transparent",
      opacity: cell.active ? cell.opacity : 0,
      border: "1px solid rgba(0, 255, 255, 0.1)",
      boxShadow: cell.active ? "0 0 12px rgba(0, 255, 255, 0.6)" : "none",
    }}
    className="rounded-lg transition-all duration-200"
  />
);

// Header Component remains the same
const Header = ({ isRunning, setIsRunning }) => (
  <header className="bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 shadow-2xl p-6 sticky top-0 z-50 border-b-2 border-cyan-500">
    <div className="max-w-6xl mx-auto flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <span className="text-3xl text-cyan-400">🎮</span>
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-tight">
          Cyber Rain
        </h1>
      </div>
      <button
        onClick={() => setIsRunning(!isRunning)}
        className={`
          px-6 py-3 rounded-lg font-bold text-lg
          transition-all duration-300 transform hover:scale-105
          shadow-lg shadow-cyan-500/20
          flex items-center space-x-2
          ${isRunning 
            ? "bg-gradient-to-r from-red-500 to-red-600 text-white" 
            : "bg-gradient-to-r from-green-500 to-green-600 text-white"
          }
        `}
      >
        <span className="mr-2">{isRunning ? '⏸️' : '▶️'}</span>
        <span>{isRunning ? 'Pause' : 'Play'}</span>
      </button>
    </div>
  </header>
);

// Controls Component
const Controls = ({ rows, setRows, cols, setCols }) => (
  <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-xl p-8 mb-10 border-2 border-cyan-800 shadow-2xl">
    <div className="flex flex-wrap gap-8 items-center justify-center">
      {[
        { label: "Rows", value: rows, setValue: setRows },
        { label: "Columns", value: cols, setValue: setCols }
      ].map(({ label, value, setValue }) => (
        <div key={label} className="relative group">
          <label className="text-cyan-400 font-bold mb-3 text-lg block text-center">
            {label}
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(Math.min(40, Math.max(1, parseInt(e.target.value) || 1)))}
            className="
              bg-gray-900 text-cyan-300 text-center p-3 rounded-lg w-32
              border-2 border-cyan-700 shadow-lg
              focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
              transition-all duration-300
              appearance-none
            "
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 group-hover:opacity-20 rounded-lg transition-opacity duration-300" />
        </div>
      ))}
    </div>
  </div>
);

// Main Component
const RainAnimation = () => {
  const [grid, setGrid] = useState([]);
  const [rows, setRows] = useState(15);
  const [cols, setCols] = useState(20);
  const [isRunning, setIsRunning] = useState(true);
  const [cellSize, setCellSize] = useState(20);
  const [containerRef, setContainerRef] = useState(null);

  const getRandomColor = () => {
    const hue = Math.random() * 40 + 190;
    const saturation = Math.random() * 30 + 70;
    const lightness = Math.random() * 30 + 50;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  // Calculate cell size based on container width and columns
  useEffect(() => {
    if (!containerRef) return;

    const calculateCellSize = () => {
      const containerWidth = containerRef.clientWidth - 64; // Subtract padding
      const gap = 6;
      const newSize = Math.floor((containerWidth - (gap * (cols - 1))) / cols);
      setCellSize(Math.min(Math.max(newSize, 10), 20)); // Min 10px, Max 20px
    };

    calculateCellSize();
    window.addEventListener('resize', calculateCellSize);
    return () => window.removeEventListener('resize', calculateCellSize);
  }, [containerRef, cols]);

  useEffect(() => {
    const initialGrid = Array(rows).fill().map(() => 
      Array(cols).fill().map(() => ({
        active: Math.random() < 0.3,
        color: getRandomColor(),
        opacity: Math.random() * 0.5 + 0.5,
      }))
    );
    setGrid(initialGrid);
  }, [rows, cols]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setGrid(prevGrid => {
        const newGrid = JSON.parse(JSON.stringify(prevGrid));
        
        for (let i = rows - 1; i >= 0; i--) {
          for (let j = 0; j < cols; j++) {
            if (i === 0) {
              newGrid[i][j] = {
                active: Math.random() < 0.3,
                color: getRandomColor(),
                opacity: Math.random() * 0.5 + 0.5,
              };
            } else if (prevGrid[i - 1][j].active) {
              newGrid[i][j] = {
                active: true,
                color: prevGrid[i - 1][j].color,
                opacity: prevGrid[i - 1][j].opacity,
              };
              newGrid[i - 1][j] = {
                active: false,
                color: getRandomColor(),
                opacity: Math.random() * 0.5 + 0.5,
              };
            }
          }
        }
        return newGrid;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, rows, cols]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950">
      <Header isRunning={isRunning} setIsRunning={setIsRunning} />
      
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-12">
          <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 mb-4">
            Neon Rain
          </h2>
          <p className="text-cyan-400 text-lg">
            Enter the matrix and customize your cyber rain pattern
          </p>
        </div>

        <Controls rows={rows} setRows={setRows} cols={cols} setCols={setCols} />

        <div 
          ref={setContainerRef}
          className="backdrop-blur-xl bg-black/40 p-8 rounded-xl shadow-2xl border-2 border-cyan-800 overflow-x-auto"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
              gap: "6px",
              justifyContent: "center",
            }}
            className="min-w-fit"
          >
            {grid.map((row, i) =>
              row.map((cell, j) => (
                <RainCell 
                  key={`${i}-${j}`} 
                  cell={cell} 
                  size={`${cellSize}px`}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RainAnimation;