function SokobanStats({ moves, solved, mode }) {
  return (
    <div
      style={{
        marginTop: "20px",
        padding: "15px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h3>Estadisticas</h3>

      <p>
        <strong>Movimientos:</strong> {moves}
      </p>

      <p>
        <strong>Modo:</strong> {mode}
      </p>

      <p>
        <strong>Estado:</strong> {solved ? "Completado" : "En progreso"}
      </p>
    </div>
  );
}

export default SokobanStats;
