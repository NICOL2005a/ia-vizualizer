import { useState, useEffect } from "react";
import Layout from "../components/Layout";

const TOOLS = {
  FLOOR: ".",
  WALL: "#",
  PLAYER: "P",
  BOX: "B",
  TARGET: "T",
};

const createBoard = (size) =>
  Array(size)
    .fill()
    .map(() => Array(size).fill("."));

export default function Sokoban() {
  const [size, setSize] = useState(6);
  const [board, setBoard] = useState(createBoard(6));
  const [mode, setMode] = useState("manual");
  const [tool, setTool] = useState(TOOLS.WALL);
  const [moves, setMoves] = useState(0);
  const [targets, setTargets] = useState([]);
  const [win, setWin] = useState(false);
  const [solution, setSolution] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [history, setHistory] = useState([]);

  const changeSize = (newSize) => {
    const numericSize = Number(newSize);
    setSize(numericSize);
    setBoard(createBoard(numericSize));
    setTargets([]);
    setMoves(0);
    setWin(false);
    setSolution([]);
    setCurrentStep(0);
    setHistory([]);
  };

  const editCell = (row, col) => {
    const newBoard = board.map((r) => [...r]);

    if (tool === TOOLS.PLAYER) {
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (newBoard[r][c] === TOOLS.PLAYER) {
            newBoard[r][c] = TOOLS.FLOOR;
          }
        }
      }
    }

    if (tool === TOOLS.TARGET) {
      const exists = targets.some(([r, c]) => r === row && c === col);
      if (!exists) setTargets((prev) => [...prev, [row, col]]);
    }

    newBoard[row][col] = tool;
    setBoard(newBoard);
    setWin(false);
    setSolution([]);
    setCurrentStep(0);
    setHistory([]);
  };

  const clearBoard = () => {
    setBoard(createBoard(size));
    setTargets([]);
    setWin(false);
    setMoves(0);
    setSolution([]);
    setCurrentStep(0);
    setHistory([]);
  };

  const checkVictory = (currentBoard) => {
    const boxes = [];

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (currentBoard[r][c] === TOOLS.BOX) {
          boxes.push([r, c]);
        }
      }
    }

    if (boxes.length === 0 || targets.length === 0) return;

    const solved = boxes.every(([boxR, boxC]) =>
      targets.some(([targetR, targetC]) => boxR === targetR && boxC === targetC)
    );

    if (solved) {
      setWin(true);
      setHistory((prev) => [...prev, "🎉 Nivel completado"]);
    }
  };

  const movePlayer = (dr, dc) => {
    const newBoard = board.map((r) => [...r]);

    let playerRow = -1;
    let playerCol = -1;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (newBoard[r][c] === TOOLS.PLAYER) {
          playerRow = r;
          playerCol = c;
        }
      }
    }

    if (playerRow === -1) return false;

    const nextRow = playerRow + dr;
    const nextCol = playerCol + dc;

    if (nextRow < 0 || nextRow >= size || nextCol < 0 || nextCol >= size) {
      return false;
    }

    const nextCell = newBoard[nextRow][nextCol];

    if (nextCell === TOOLS.WALL) return false;

    if (nextCell === TOOLS.BOX) {
      const boxNextRow = nextRow + dr;
      const boxNextCol = nextCol + dc;

      if (
        boxNextRow < 0 ||
        boxNextRow >= size ||
        boxNextCol < 0 ||
        boxNextCol >= size
      ) {
        return false;
      }

      const boxNextCell = newBoard[boxNextRow][boxNextCol];

      if (boxNextCell === TOOLS.WALL || boxNextCell === TOOLS.BOX) {
        return false;
      }

      newBoard[boxNextRow][boxNextCol] = TOOLS.BOX;
      newBoard[nextRow][nextCol] = TOOLS.PLAYER;
      newBoard[playerRow][playerCol] = TOOLS.FLOOR;

      setBoard(newBoard);
      checkVictory(newBoard);
      setMoves((prev) => prev + 1);
      return true;
    }

    newBoard[playerRow][playerCol] = TOOLS.FLOOR;
    newBoard[nextRow][nextCol] = TOOLS.PLAYER;

    setBoard(newBoard);
    checkVictory(newBoard);
    setMoves((prev) => prev + 1);
    return true;
  };

  const runAI = async () => {
    if (mode !== "ia") return;

    try {
      setHistory(["Buscando solución con A*..."]);
      setSolution([]);
      setCurrentStep(0);

      const response = await fetch("https://backend-production-c5264.up.railway.app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ board }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Error en el backend");
        return;
      }

      if (!data.solution || data.solution.length === 0) {
        setHistory([
          "No se encontró solución.",
          `Nodos visitados: ${data.visited ?? 0}`,
        ]);
        return;
      }

      setSolution(data.solution);
      setHistory([
        `Solución encontrada: ${data.solution.length} movimientos`,
        `Nodos visitados: ${data.visited}`,
        `Costo: ${data.cost}`,
      ]);
    } catch (error) {
      alert("Error al conectar con el backend de Sokoban");
    }
  };

  const nextAIStep = () => {
    if (mode !== "ia") return;
    if (currentStep >= solution.length) return;

    const move = solution[currentStep];
    let moved = false;

    if (move === "UP") moved = movePlayer(-1, 0);
    if (move === "DOWN") moved = movePlayer(1, 0);
    if (move === "LEFT") moved = movePlayer(0, -1);
    if (move === "RIGHT") moved = movePlayer(0, 1);

    if (moved) {
      setHistory((prev) => [...prev, `Paso ${currentStep + 1}: ${move}`]);
      setCurrentStep((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (mode !== "manual") return;

      if (e.key === "ArrowUp") movePlayer(-1, 0);
      if (e.key === "ArrowDown") movePlayer(1, 0);
      if (e.key === "ArrowLeft") movePlayer(0, -1);
      if (e.key === "ArrowRight") movePlayer(0, 1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [board, mode, targets]);

  return (
    <Layout>
      <div style={{ padding: "30px" }}>
        <h1>📦 Sokoban</h1>

        {win && <div style={winStyle}>🎉 ¡Nivel completado!</div>}

        <p style={{ color: "#666" }}>
          Crea tu nivel, juega manualmente o deja que la IA lo resuelva con A*.
        </p>

        <div style={{ display: "flex", gap: "30px", marginTop: "20px" }}>
          <div style={cardStyle}>
            <h2>Tablero</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${size}, 65px)`,
                gap: "5px",
                marginTop: "15px",
              }}
            >
              {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  const isTarget = targets.some(
                    ([r, c]) => r === rowIndex && c === colIndex
                  );

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => editCell(rowIndex, colIndex)}
                      style={getCellStyle(cell, isTarget)}
                    >
                      {getCellIcon(cell, isTarget)}
                    </div>
                  );
                })
              )}
            </div>

            <p style={{ marginTop: "15px", color: "#666" }}>
              Selecciona una herramienta y da click en el tablero.
            </p>

            <p style={{ color: "#666" }}>
              En modo manual usa las flechas ↑ ↓ ← → para mover al jugador.
            </p>
          </div>

          <div style={{ ...cardStyle, width: "330px" }}>
            <h2>Configuración</h2>

            <p>Modo</p>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              style={selectStyle}
            >
              <option value="manual">Jugar manualmente</option>
              <option value="ia">Resolver con IA</option>
            </select>

            <p style={{ marginTop: "18px" }}>Tamaño del grid</p>
            <select
              value={size}
              onChange={(e) => changeSize(e.target.value)}
              style={selectStyle}
            >
              <option value="5">5x5</option>
              <option value="6">6x6</option>
              <option value="8">8x8</option>
            </select>

            <p style={{ marginTop: "18px" }}>Herramienta</p>
            <select
              value={tool}
              onChange={(e) => setTool(e.target.value)}
              style={selectStyle}
            >
              <option value=".">Piso</option>
              <option value="#">Pared</option>
              <option value="P">Jugador</option>
              <option value="B">Caja</option>
              <option value="T">Objetivo</option>
            </select>

            <p style={{ marginTop: "18px" }}>Algoritmo</p>
            <div style={inputBox}>A*</div>

            <button style={buttonStyle} onClick={mode === "ia" ? runAI : undefined}>
              {mode === "manual" ? "Iniciar juego" : "Ejecutar IA"}
            </button>

            <button style={buttonStyle} onClick={nextAIStep}>
              Paso siguiente
            </button>

            <button style={buttonStyle} onClick={clearBoard}>
              Limpiar tablero
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: "20px", marginTop: "25px" }}>
          <div style={panelStyle}>
            <h2>Estadísticas</h2>
            <p>Modo: {mode === "manual" ? "Manual" : "IA"}</p>
            <p>Algoritmo: A*</p>
            <p>Cajas: {board.flat().filter((c) => c === "B").length}</p>
            <p>Objetivos: {targets.length}</p>
            <p>Movimientos: {moves}</p>
            <p>Pasos IA: {currentStep}/{solution.length}</p>
          </div>

          <div style={panelStyle}>
            <h2>Historial</h2>
            {history.length === 0 ? (
              <p>Esperando acción...</p>
            ) : (
              <ul>
                {history.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function getCellIcon(cell, isTarget) {
  if (cell === "#") return "🧱";
  if (cell === "P") return "🧍";
  if (cell === "B" && isTarget) return "✅📦";
  if (cell === "B") return "📦";
  if (isTarget) return "🎯";
  return "";
}

function getCellStyle(cell, isTarget) {
  let background = "#e0f2fe";

  if (isTarget) background = "#22c55e";
  if (cell === "#") background = "#1f2937";
  if (cell === "P") background = "#f59e0b";
  if (cell === "B") background = isTarget ? "#16a34a" : "#a16207";

  return {
    width: "65px",
    height: "65px",
    background,
    borderRadius: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "26px",
    cursor: "pointer",
    transition: "0.2s",
  };
}

const winStyle = {
  background: "#22c55e",
  color: "white",
  padding: "15px",
  borderRadius: "10px",
  marginTop: "10px",
  marginBottom: "15px",
  fontWeight: "bold",
};

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "15px",
  boxShadow: "0 2px 10px rgba(0,0,0,.08)",
};

const panelStyle = {
  flex: 1,
  background: "white",
  padding: "20px",
  borderRadius: "15px",
  boxShadow: "0 2px 10px rgba(0,0,0,.08)",
};

const selectStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
};

const inputBox = {
  width: "100%",
  padding: "10px",
  background: "#f3f4f6",
  borderRadius: "8px",
  marginTop: "5px",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "15px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};