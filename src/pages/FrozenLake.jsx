import { useState } from "react";

import Layout from "../components/Layout";
import FrozenLakeBoard from "../components/FrozenLakeBoard";
import FrozenLakeStats from "../components/FrozenLakeStats";
import FrozenLakeHistory from "../components/FrozenLakeHistory";



const CELL_TYPES = ["F", "H", "S", "G"];

const createBoard = (size) => {
  return Array(size)
    .fill()
    .map(() => Array(size).fill("F"));
};

export default function FrozenLake() {
  
  const algorithm = "BFS";

  const [size, setSize] =
    useState(4);

  const [board, setBoard] =
    useState(createBoard(4));

  const [visitedCells, setVisitedCells] =
    useState([]);

  const [solutionPath, setSolutionPath] =
    useState([]);

  const [history, setHistory] =
    useState([]);

  const [visitedNodes, setVisitedNodes] =
    useState(0);

  const [expandedNodes, setExpandedNodes] =
    useState(0);

  const changeCell = (
    row,
    col
  ) => {
    const newBoard = board.map(
      (r) => [...r]
    );

    const current =
      board[row][col];

    const currentIndex =
      CELL_TYPES.indexOf(current);

    const nextType =
      CELL_TYPES[
        (currentIndex + 1) %
          CELL_TYPES.length
      ];

    newBoard[row][col] =
      nextType;

    setBoard(newBoard);
  };

  const changeBoardSize = (
    value
  ) => {
    const newSize =
      Number(value);

    setSize(newSize);

    setBoard(
      createBoard(newSize)
    );

    resetSimulation();
  };

  const resetSimulation = () => {
    setVisitedCells([]);
    setSolutionPath([]);
    setHistory([]);
    setVisitedNodes(0);
    setExpandedNodes(0);
  };

  const runBFS = async () => {
    try {
      resetSimulation();

      const startCount =
        board.flat().filter(
          (c) => c === "S"
        ).length;

      const goalCount =
        board.flat().filter(
          (c) => c === "G"
        ).length;

      if (
        startCount !== 1
      ) {
        alert(
          "Debe existir exactamente un S"
        );
        return;
      }

      if (
        goalCount !== 1
      ) {
        alert(
          "Debe existir exactamente un G"
        );
        return;
      }

      const response = await fetch(
  "https://backend-production-c5264.up.railway.app/bfs",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      board,
    }),
  }
);

const result = await response.json();

const visitedOrder = result.visitedOrder || result.visited_order || [];
const path = result.path || [];

visitedOrder.forEach((node, index) => {
  setTimeout(() => {
    setVisitedCells((prev) => [...prev, node]);

    setHistory((prev) => [
      ...prev,
      `Visitado (${node[0]}, ${node[1]})`,
    ]);

    setVisitedNodes(index + 1);
    setExpandedNodes(index);
  }, index * 300);
});

const delay = visitedOrder.length * 300;

setTimeout(() => {
  setSolutionPath(path);

  setHistory((prev) => [
    ...prev,
    path.length > 0 ? "Camino encontrado" : "No se encontró camino",
  ]);
}, delay);

        setHistory(
          (prev) => [
            ...prev,
            "Camino encontrado",
          ]
        );
      }, delay);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Layout>
      <div
        style={{
          padding: "30px",
        }}
      >
        <h1>
          🧊 Frozen Lake
        </h1>

        <div
          style={{
            display: "flex",
            gap: "30px",
            marginTop:
              "20px",
          }}
        >
          <FrozenLakeBoard
            board={board}
            visitedCells={
              visitedCells
            }
            solutionPath={
              solutionPath
            }
            onCellClick={
              changeCell
            }
          />

          {/* CONFIG */}

          <div
            style={{
              width:
                "320px",
              background:
                "white",
              padding: "20px",
              borderRadius:
                "15px",
              boxShadow:
                "0 2px 10px rgba(0,0,0,.08)",
            }}
          >
            <h2>
              Configuración
            </h2>

            <p>
              Algoritmo
            </p>

            <div
              style={{
                width: "100%",
                padding: "10px",
                background: "#f3f4f6",
                borderRadius: "8px",
                marginTop: "5px",
              }}
            >
              BFS
            </div>

            <p
              style={{
                marginTop:
                  "20px",
              }}
            >
              Tamaño del
              mapa
            </p>

            <select
              value={size}
              onChange={(e) =>
                changeBoardSize(
                  e.target.value
                )
              }
              style={{
                width:
                  "100%",
                padding:
                  "10px",
              }}
            >
              <option value="4">
                4x4
              </option>

              <option value="6">
                6x6
              </option>

              <option value="8">
                8x8
              </option>
            </select>

            <button
              style={
                buttonStyle
              }
              onClick={
                runBFS
              }
            >
              Ejecutar
            </button>

            <button
              style={
                buttonStyle
              }
              onClick={
                resetSimulation
              }
            >
              Reiniciar
            </button>
          </div>
        </div>

        <div
          style={{
            display:
              "flex",
            gap: "20px",
            marginTop:
              "25px",
          }}
        >
          <FrozenLakeStats
            algorithm={
              algorithm
            }
            visitedNodes={
              visitedNodes
            }
            expandedNodes={
              expandedNodes
            }
            pathLength={
              solutionPath.length
            }
          />

          <FrozenLakeHistory
            history={
              history
            }
          />
        </div>
      </div>
    </Layout>
  );
}

const buttonStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "15px",
  border: "none",
  borderRadius:
    "8px",
  cursor: "pointer",
};