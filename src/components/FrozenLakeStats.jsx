export default function FrozenLakeStats({
  algorithm,
  visitedNodes,
  expandedNodes,
  pathLength,
}) {
  return (
    <div
      style={{
        flex: 1,
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
        Estadísticas
      </h2>

      <p>
        Algoritmo:
        {" "}
        {algorithm}
      </p>

      <p>
        Nodos visitados:
        {" "}
        {visitedNodes}
      </p>

      <p>
        Nodos expandidos:
        {" "}
        {expandedNodes}
      </p>

      <p>
        Longitud del camino:
        {" "}
        {pathLength}
      </p>
    </div>
  );
}