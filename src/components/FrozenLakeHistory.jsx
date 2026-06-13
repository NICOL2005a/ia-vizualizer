export default function FrozenLakeHistory({
  history,
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
        Historial
      </h2>

      <ul>
        {history.map(
          (
            step,
            index
          ) => (
            <li
              key={index}
            >
              {step}
            </li>
          )
        )}
      </ul>
    </div>
  );
}