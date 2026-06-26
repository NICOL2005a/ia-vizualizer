import { useCallback, useEffect, useState } from "react";
import Layout from "../components/Layout";

const TOOLS = {
  FLOOR: ".",
  WALL: "#",
  PLAYER: "P",
  BOX: "B",
  TARGET: "T",
};

const API_BASE_URL = "https://backend-production-c5264.up.railway.app";
const ALGORITHMS = {
  astar: "A*",
  gbfs: "GBFS (Greedy)",
};
const GAME_MODES = {
  manual: "Jugar manualmente",
  astar: "Resolver con A*",
  gbfs: "Resolver con GBFS",
};

const DIRECTIONS = {
  UP: [-1, 0],
  DOWN: [1, 0],
  LEFT: [0, -1],
  RIGHT: [0, 1],
};

const createBoard = (size) =>
  Array(size)
    .fill()
    .map(() => Array(size).fill(TOOLS.FLOOR));

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
  const [initialBoard, setInitialBoard] = useState(createBoard(6));
  const [initialTargets, setInitialTargets] = useState([]);

  const resetRunState = () => {
    setWin(false);
    setSolution([]);
    setCurrentStep(0);
    setHistory([]);
  };

  const changeSize = (newSize) => {
    const numericSize = Number(newSize);
    setSize(numericSize);
    const emptyBoard = createBoard(numericSize);
    setBoard(emptyBoard);
    setInitialBoard(emptyBoard);
    setTargets([]);
    setInitialTargets([]);
    setMoves(0);
    resetRunState();
  };

  const editCell = (row, col) => {
    const newBoard = board.map((currentRow) => [...currentRow]);
    let nextTargets;

    if (tool === TOOLS.PLAYER) {
      for (let r = 0; r < size; r += 1) {
        for (let c = 0; c < size; c += 1) {
          if (newBoard[r][c] === TOOLS.PLAYER) {
            newBoard[r][c] = TOOLS.FLOOR;
          }
        }
      }
    }

    if (tool === TOOLS.TARGET) {
      const exists = targets.some(([targetR, targetC]) => targetR === row && targetC === col);
      nextTargets = exists ? targets : [...targets, [row, col]];
      newBoard[row][col] = TOOLS.FLOOR;
    } else {
      nextTargets = targets.filter(([targetR, targetC]) => targetR !== row || targetC !== col);
      newBoard[row][col] = tool;
    }

    setBoard(newBoard);
    setTargets(nextTargets);
    setInitialBoard(newBoard.map((currentRow) => [...currentRow]));
    setInitialTargets(nextTargets.map((target) => [...target]));
    resetRunState();
  };

  const clearBoard = () => {
    setBoard(createBoard(size));
    setInitialBoard(createBoard(size));
    setTargets([]);
    setInitialTargets([]);
    setMoves(0);
    resetRunState();
  };

  const resetGame = () => {
    setBoard(initialBoard.map((currentRow) => [...currentRow]));
    setTargets(initialTargets.map((target) => [...target]));
    setMoves(0);
    resetRunState();
  };

  const checkVictory = useCallback(
    (currentBoard) => {
      const boxes = [];

      for (let r = 0; r < size; r += 1) {
        for (let c = 0; c < size; c += 1) {
          if (currentBoard[r][c] === TOOLS.BOX) {
            boxes.push([r, c]);
          }
        }
      }

      if (boxes.length === 0 || targets.length === 0) return;

      const solved = boxes.every(([boxR, boxC]) =>
        targets.some(([targetR, targetC]) => boxR === targetR && boxC === targetC),
      );

      if (solved) {
        setWin(true);
        setHistory((current) => [...current, "Nivel completado"]);
      }
    },
    [size, targets],
  );

  const movePlayer = useCallback(
    (dr, dc) => {
      const newBoard = board.map((currentRow) => [...currentRow]);
      let playerRow = -1;
      let playerCol = -1;

      for (let r = 0; r < size; r += 1) {
        for (let c = 0; c < size; c += 1) {
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
      } else {
        newBoard[playerRow][playerCol] = TOOLS.FLOOR;
        newBoard[nextRow][nextCol] = TOOLS.PLAYER;
      }

      setBoard(newBoard);
      checkVictory(newBoard);
      setMoves((current) => current + 1);
      return true;
    },
    [board, checkVictory, size],
  );

  const runAI = async () => {
    if (mode === "manual") return;

    try {
      setHistory([`Buscando solucion con ${ALGORITHMS[mode]}...`]);
      setSolution([]);
      setCurrentStep(0);

      const response = await fetch(`${API_BASE_URL}/sokoban`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          board: board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isTarget = targets.some(([targetR, targetC]) => {
                return targetR === rowIndex && targetC === colIndex;
              });
              return isTarget && cell === TOOLS.FLOOR ? TOOLS.TARGET : cell;
            }),
          ),
          algorithm: mode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Error en el backend");
        return;
      }

      if (!data.solution || data.solution.length === 0) {
        setHistory([
          "No se encontro solucion.",
          `Nodos visitados: ${data.visited ?? 0}`,
        ]);
        return;
      }

      setSolution(data.solution);
      setHistory([
        `Solucion encontrada con ${ALGORITHMS[mode]}: ${data.solution.length} movimientos`,
        `Nodos visitados: ${data.visited}`,
        `Costo: ${data.cost}`,
      ]);
    } catch (error) {
      alert(`Error al conectar con el backend de Sokoban: ${error.message}`);
    }
  };

  const nextAIStep = () => {
    if (mode === "manual") return;
    if (currentStep >= solution.length) return;

    const move = solution[currentStep];
    const direction = DIRECTIONS[move];
    const moved = direction ? movePlayer(direction[0], direction[1]) : false;

    if (moved) {
      setHistory((current) => [...current, `Paso ${currentStep + 1}: ${move}`]);
      setCurrentStep((current) => current + 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (mode !== "manual") return;

      if (event.key === "ArrowUp") movePlayer(-1, 0);
      if (event.key === "ArrowDown") movePlayer(1, 0);
      if (event.key === "ArrowLeft") movePlayer(0, -1);
      if (event.key === "ArrowRight") movePlayer(0, 1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, movePlayer]);

  return (
    <Layout>
      <div style={{ padding: "30px" }}>
        <h1>Sokoban</h1>

        {win && <div style={winStyle}>Nivel completado</div>}

        <p style={{ color: "#666" }}>
          Crea tu nivel, juega manualmente o deja que la IA lo resuelva con A* o GBFS.
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
                    ([targetR, targetC]) => targetR === rowIndex && targetC === colIndex,
                  );

                  return (
                    <button
                      type="button"
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => editCell(rowIndex, colIndex)}
                      style={getCellStyle(cell, isTarget)}
                    >
                      {getCellIcon(cell, isTarget)}
                    </button>
                  );
                }),
              )}
            </div>

            <p style={{ marginTop: "15px", color: "#666" }}>
              Selecciona una herramienta y da click en el tablero.
            </p>

            <p style={{ color: "#666" }}>
              En modo manual usa las flechas para mover al jugador.
            </p>
          </div>

          <div style={{ ...cardStyle, width: "330px" }}>
            <h2>Configuracion</h2>

            <p>Modo</p>
            <select
              value={mode}
              onChange={(e) => {
                setMode(e.target.value);
                resetRunState();
              }}
              style={selectStyle}
            >
              {Object.entries(GAME_MODES).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>

            <p style={{ marginTop: "18px" }}>Tamano del grid</p>
            <select value={size} onChange={(e) => changeSize(e.target.value)} style={selectStyle}>
              <option value="5">5x5</option>
              <option value="6">6x6</option>
              <option value="8">8x8</option>
            </select>

            <p style={{ marginTop: "18px" }}>Herramienta</p>
            <select value={tool} onChange={(e) => setTool(e.target.value)} style={selectStyle}>
              <option value=".">Piso</option>
              <option value="#">Pared</option>
              <option value="P">Jugador</option>
              <option value="B">Caja</option>
              <option value="T">Objetivo</option>
            </select>

            <button type="button" style={buttonStyle} onClick={mode === "manual" ? undefined : runAI}>
              {mode === "manual" ? "Iniciar juego" : "Ejecutar IA"}
            </button>

            <button type="button" style={buttonStyle} onClick={nextAIStep}>
              Paso siguiente
            </button>

            <button type="button" style={buttonStyle} onClick={resetGame}>
              Reiniciar juego
            </button>

            <button type="button" style={buttonStyle} onClick={clearBoard}>
              Limpiar tablero
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: "20px", marginTop: "25px" }}>
          <div style={panelStyle}>
            <h2>Estadisticas</h2>
            <p>Modo: {GAME_MODES[mode]}</p>
            <p>Algoritmo: {mode === "manual" ? "N/A" : ALGORITHMS[mode]}</p>
            <p>Cajas: {board.flat().filter((cell) => cell === TOOLS.BOX).length}</p>
            <p>Objetivos: {targets.length}</p>
            <p>Movimientos: {moves}</p>
            <p>
              Pasos IA: {currentStep}/{solution.length}
            </p>
          </div>

          <div style={panelStyle}>
            <h2>Historial</h2>
            {history.length === 0 ? (
              <p>Esperando accion...</p>
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
  if (cell === TOOLS.WALL) return "#";
  if (cell === TOOLS.PLAYER) return "P";
  if (cell === TOOLS.BOX && isTarget) return "B/T";
  if (cell === TOOLS.BOX) return "B";
  if (isTarget) return "T";
  return "";
}

function getCellStyle(cell, isTarget) {
  let background = "#e0f2fe";

  if (isTarget) background = "#22c55e";
  if (cell === TOOLS.WALL) background = "#1f2937";
  if (cell === TOOLS.PLAYER) background = "#f59e0b";
  if (cell === TOOLS.BOX) background = isTarget ? "#16a34a" : "#a16207";

  return {
    width: "65px",
    height: "65px",
    background,
    border: 0,
    borderRadius: "10px",
    color: cell === TOOLS.WALL ? "white" : "#111827",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "18px",
    fontWeight: 700,
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

const buttonStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "15px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};
