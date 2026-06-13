export default function FrozenLakeBoard({
  board,
  visitedCells,
  solutionPath,
  onCellClick,
}) {
  const getCellStyle = (
    cell,
    row,
    col
  ) => {
    let background =
      "#60a5fa";

    if (cell === "H")
      background =
        "#ef4444";

    if (cell === "S")
      background =
        "#f59e0b";

    if (cell === "G")
      background =
        "#22c55e";

    const isVisited =
      visitedCells.some(
        ([r, c]) =>
          r === row &&
          c === col
      );

    const isPath =
      solutionPath.some(
        ([r, c]) =>
          r === row &&
          c === col
      );

    if (isVisited)
      background =
        "#8b5cf6";

    if (isPath)
      background =
        "#10b981";

    return {
      width: "80px",
      height: "80px",
      background,
      color: "white",
      display: "flex",
      justifyContent:
        "center",
      alignItems:
        "center",
      borderRadius:
        "10px",
      fontWeight:
        "bold",
      fontSize: "22px",
      cursor: "pointer",
      transition:
        "0.3s",
    };
  };

  return (
    <div
      style={{
        background:
          "white",
        padding: "20px",
        borderRadius:
          "15px",
        boxShadow:
          "0 2px 10px rgba(0,0,0,.08)",
      }}
    >
      <h2>Mapa</h2>

      <div
        style={{
          display:
            "grid",
          gridTemplateColumns:
            `repeat(${board.length},80px)`,
          gap: "5px",
          marginTop:
            "15px",
        }}
      >
        {board.map(
          (
            row,
            rowIndex
          ) =>
            row.map(
              (
                cell,
                colIndex
              ) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  style={getCellStyle(
                    cell,
                    rowIndex,
                    colIndex
                  )}
                  onClick={() =>
                    onCellClick(
                      rowIndex,
                      colIndex
                    )
                  }
                >
                  {cell}
                </div>
              )
            )
        )}
      </div>

      <p
        style={{
          marginTop:
            "15px",
        }}
      >
        F → H → S → G → F
      </p>
    </div>
  );
}