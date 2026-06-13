import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div style={sidebarStyle}>
      <h2 style={{ marginBottom: "40px" }}>IA Visualizer</h2>

      <Link style={linkStyle} to="/">🏠 Inicio</Link>
      <Link style={linkStyle} to="/frozenlake">🧊 Frozen Lake</Link>
      <Link style={linkStyle} to="/sokoban">📦 Sokoban</Link>
      <Link style={linkStyle} to="/tictactoe">🎮 Tic Tac Toe</Link>
      <Link style={linkStyle} to="/eightqueens">♛ Reinas</Link>
    </div>
  );
}

const sidebarStyle = {
  width: "260px",
  background: "#0f172a",
  color: "white",
  minHeight: "100vh",
  padding: "25px",
};

const linkStyle = {
  display: "block",
  color: "white",
  textDecoration: "none",
  marginBottom: "25px",
};