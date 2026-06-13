// src/components/SokobanHistory.jsx

import React from "react";

function SokobanHistory({ history }) {
  return (
    <div
      style={{
        marginTop: "20px",
        padding: "15px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        maxHeight: "250px",
        overflowY: "auto",
      }}
    >
      <h3>Historial de movimientos</h3>

      {history.length === 0 ? (
        <p>No hay movimientos aún.</p>
      ) : (
        <ol>
          {history.map((move, index) => (
            <li key={index}>
              {move}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default SokobanHistory;