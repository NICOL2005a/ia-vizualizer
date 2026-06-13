export default function ControlPanel({
  algorithm,
  setAlgorithm,
}) {
  return (
    <div className="panel">

      <h3>Configuración</h3>

      <select
        value={algorithm}
        onChange={(e) =>
          setAlgorithm(e.target.value)
        }
      >
        <option>BFS</option>
        <option>DFS</option>
        <option>A*</option>
      </select>

      <button>
        Ejecutar
      </button>

      <button>
        Paso siguiente
      </button>

      <button>
        Paso anterior
      </button>

      <button>
        Reiniciar
      </button>

    </div>
  );
}