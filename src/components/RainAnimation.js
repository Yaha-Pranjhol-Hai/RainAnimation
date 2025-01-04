import React, { useState, useEffect } from "react";

const RainAnimation = () => {
  const [grid, setGrid] = useState([]);
  const [rows, setRows] = useState(15);
  const [cols, setCols] = useState(20);
  const [isRunning, setIsRunning] = useState(true);

  const getRandomColor = () => {
    const hue = Math.random() * 40 + 190;
    const saturation = Math.random() * 30 + 70;
    const lightness = Math.random() * 30 + 50;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  useEffect(() => {
    const initialGrid = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        row.push({
          active: Math.random() < 0.3,
          color: getRandomColor(),
          opacity: Math.random() * 0.5 + 0.5,
        });
      }
      initialGrid.push(row);
    }
    setGrid(initialGrid);
  }, [rows, cols]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setGrid((prevGrid) => {
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <header className="bg-gradient-to-r from-purple-900 to-blue-900 shadow-xl p-4 sticky top-0 z-50 border-b border-indigo-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-cyan-400 tracking-wide">
            Gaming Rain Animation
          </h1>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-110 shadow-lg text-black ${
              isRunning
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isRunning ? "Pause" : "Play"}
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-8">
          <h2 className="text-5xl font-extrabold text-cyan-400 drop-shadow-md mb-4">
            Neon Rain
          </h2>
          <p className="text-cyan-300">
            Customize your grid and watch the rain fall in real time!
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-6 mb-10 border border-cyan-800 shadow-lg">
          <div className="flex flex-wrap gap-6 items-center justify-center">
            <div className="flex flex-col items-center">
              <label className="text-cyan-300 font-medium mb-2 text-lg">
                Rows
              </label>
              <input
                type="number"
                value={rows}
                onChange={(e) =>
                  setRows(Math.min(30, Math.max(1, parseInt(e.target.value) || 1)))
                }
                className="bg-gray-900 text-cyan-400 text-center p-2 rounded-lg w-28 border border-cyan-500 shadow-md"
              />
            </div>
            <div className="flex flex-col items-center">
              <label className="text-cyan-300 font-medium mb-2 text-lg">
                Columns
              </label>
              <input
                type="number"
                value={cols}
                onChange={(e) =>
                  setCols(Math.min(40, Math.max(1, parseInt(e.target.value) || 1)))
                }
                className="bg-gray-900 text-cyan-400 text-center p-2 rounded-lg w-28 border border-cyan-500 shadow-md"
              />
            </div>
          </div>
        </div>

        <div className="backdrop-blur-md bg-black/50 p-6 rounded-lg shadow-2xl border border-cyan-700">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${cols}, 20px)`,
              gap: "6px",
              justifyContent: "center",
            }}
          >
            {grid.map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: cell.active ? cell.color : "transparent",
                    opacity: cell.active ? cell.opacity : 0,
                    border: "1px solid rgba(0, 255, 255, 0.1)",
                    boxShadow: cell.active
                      ? "0 0 12px rgba(0, 255, 255, 0.6)"
                      : "none",
                  }}
                  className="rounded-lg"
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
