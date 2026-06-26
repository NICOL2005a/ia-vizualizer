const getCellContent = (cell) => {
  switch (cell) {
    case "W":
    case "#":
      return "#";
    case "P":
      return "P";
    case "B":
      return "B";
    case "T":
      return "T";
    default:
      return "";
  }
};

const getCellBackground = (cell) => {
  switch (cell) {
    case "W":
    case "#":
      return "#6b7280";
    case "T":
      return "#fde68a";
    default:
      return "#f8fafc";
  }
};

export default function SokobanBoard({ board, onCellClick }) {
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
          <button
            type="button"
            key={`${rowIndex}-${colIndex}`}
            onClick={() => onCellClick(rowIndex, colIndex)}
            style={{
              width: "60px",
              height: "60px",
              border: "1px solid #ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "20px",
              fontWeight: 700,
              background: getCellBackground(cell),
            }}
          >
            {getCellContent(cell)}
          </button>
        )),
      )}
    </div>
  );
}
