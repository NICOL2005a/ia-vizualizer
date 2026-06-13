import React from "react";

const cellStyles = {
  width: "60px",
  height: "60px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid #ccc",
  fontSize: "30px",
  fontWeight: "bold",
};

const getCellContent = (cell) => {
  switch (cell) {
    case "W":
      return "🧱"; 

    case "P":
      return "😀"; 

    case "B":
      return "📦";

    case "T":
      return "🎯"; 

    default:
      return "";
  }
};

const getCellBackground = (cell) => {
  switch (cell) {
    case "W":
      return "#6b7280";

    case "T":
      return "#fde68a";

    default:
      return "#f8fafc";
  }
};

export default function SokobanBoard({
  board,
  onCellClick,
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${board.length}, 60px)`,
        gap: "2px",
      }}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            onClick={() =>
              onCellClick(
                rowIndex,
                colIndex
              )
            }
            style={{
              width: "60px",
              height: "60px",
              border: "1px solid #ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "28px",
              background: "white",
            }}
          >
            {getEmoji(cell)}
          </div>
        ))
      )}
    </div>
  );
}