import { useState } from "react";
import Layout from "../components/Layout";
import "../styles/tictactoe.css";

const EMPTY_BOARD = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

export default function TicTacToe() {
  const [board, setBoard] = useState(EMPTY_BOARD);
  const [message, setMessage] = useState("¡Tu turno! Juegas con O");
  const [gameOver, setGameOver] = useState(false);

  const checkWinner = (currentBoard) => {
    for (const [a, b, c] of WIN_LINES) {
      if (
        currentBoard[a] !== " " &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return currentBoard[a];
      }
    }
    return currentBoard.includes(" ") ? null : "Empate";
  };

  const handleCellClick = async (index) => {
    if (board[index] !== " " || gameOver) return;

    const playerBoard = [...board];
    playerBoard[index] = "O";
    setBoard(playerBoard);

    const humanResult = checkWinner(playerBoard);

    if (humanResult === "O") {
      setMessage("¡Felicidades! Ganaste.");
      setGameOver(true);
      return;
    }

    if (humanResult === "Empate") {
      setMessage("¡Es un empate!");
      setGameOver(true);
      return;
    }

    setMessage("La IA está pensando...");

    try {
      const response = await fetch(
        "http://localhost:8000/api/tictactoe/jugar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tablero: playerBoard })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error en la IA");
      }

      const aiBoard = [...playerBoard];
      aiBoard[data.casilla] = "X";
      setBoard(aiBoard);

      const aiResult = checkWinner(aiBoard);

      if (aiResult === "X") {
        setMessage("Perdiste. ¡Inténtalo de nuevo!");
        setGameOver(true);
      } else if (aiResult === "Empate") {
        setMessage("¡Es un empate!");
        setGameOver(true);
      } else {
        setMessage("Tu turno. Juegas con O");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error de conexión con el servidor.");
    }
  };

  const resetGame = () => {
    setBoard(EMPTY_BOARD);
    setMessage("¡Tu turno! Juegas con O");
    setGameOver(false);
  };

  return (
    <Layout>
      <div className="tictactoe-page">
        <h1>Tic-Tac-Toe</h1>
        <p>Juego de gato usando IA con algoritmo Minimax.</p>

        <section className="tictactoe-card">
          <h2>Tic-Tac-Toe - Minimax</h2>
          <h3>{message}</h3>

          <div className="tictactoe-grid">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                disabled={gameOver || cell !== " "}
                className="tictactoe-cell"
              >
                {cell}
              </button>
            ))}
          </div>

          <button onClick={resetGame} className="tictactoe-reset">
            Reiniciar juego
          </button>
        </section>
      </div>
    </Layout>
  );
}