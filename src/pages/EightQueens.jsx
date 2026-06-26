import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";

const MIN_SIZE = 4;
const MAX_SIZE = 12;
const PLAYBACK_SPEED = 800;
const QUEEN = "\u265B";

function contarConflictos(board, size) {
  let conflictos = 0;

  for (let i = 0; i < size; i += 1) {
    for (let j = i + 1; j < size; j += 1) {
      if (
        board[i] === board[j] ||
        Math.abs(i - j) === Math.abs(board[i] - board[j])
      ) {
        conflictos += 1;
      }
    }
  }

  return conflictos;
}

function conflictoReina(board, size, queenIndex) {
  let conflictos = 0;

  for (let i = 0; i < size; i += 1) {
    if (
      i !== queenIndex &&
      (board[i] === board[queenIndex] ||
        Math.abs(queenIndex - i) === Math.abs(board[queenIndex] - board[i]))
    ) {
      conflictos += 1;
    }
  }

  return conflictos;
}

function reinasEnConflicto(board, size) {
  const conflicted = new Set();

  for (let i = 0; i < size; i += 1) {
    for (let j = i + 1; j < size; j += 1) {
      if (
        board[i] === board[j] ||
        Math.abs(i - j) === Math.abs(board[i] - board[j])
      ) {
        conflicted.add(i);
        conflicted.add(j);
      }
    }
  }

  return conflicted;
}

function crearPaso(board, size, overrides = {}) {
  return {
    tablero: [...board],
    conflictos: contarConflictos(board, size),
    enConflicto: reinasEnConflicto(board, size),
    reinaMovida: -1,
    mensaje: "Tablero inicial",
    ...overrides,
  };
}

function maximaPendiente(boardInicial, size) {
  const board = [...boardInicial];
  const pasos = [crearPaso(board, size)];
  let mejora = true;

  while (mejora) {
    mejora = false;

    for (let queenIndex = 0; queenIndex < size; queenIndex += 1) {
      const conflictoActual = conflictoReina(board, size, queenIndex);
      const colActual = board[queenIndex];
      let mejorCol = colActual;
      let mejorConflicto = conflictoActual;

      for (let col = 0; col < size; col += 1) {
        board[queenIndex] = col;
        const conflictos = conflictoReina(board, size, queenIndex);

        if (conflictos < mejorConflicto) {
          mejorConflicto = conflictos;
          mejorCol = col;
        }
      }

      board[queenIndex] = mejorCol;

      if (mejorCol !== colActual) {
        mejora = true;
        pasos.push(
          crearPaso(board, size, {
            reinaMovida: queenIndex,
            deCol: colActual,
            aCol: mejorCol,
            mensaje: `Reina fila ${queenIndex + 1}: col ${colActual + 1} -> col ${
              mejorCol + 1
            } (mejor de las ${size} columnas)`,
          }),
        );
      }
    }
  }

  return { exito: contarConflictos(board, size) === 0, pasos, final: board };
}

function escaladaSimple(boardInicial, size) {
  const board = [...boardInicial];
  const pasos = [crearPaso(board, size)];
  const maxIter = size * size * 20;
  let iter = 0;
  let mejora = true;

  while (mejora && contarConflictos(board, size) > 0 && iter < maxIter) {
    mejora = false;

    for (let queenIndex = 0; queenIndex < size && !mejora; queenIndex += 1) {
      const colActual = board[queenIndex];
      const conflictoActual = conflictoReina(board, size, queenIndex);

      for (let col = 0; col < size; col += 1) {
        if (col === colActual) continue;

        board[queenIndex] = col;
        const conflictos = conflictoReina(board, size, queenIndex);
        iter += 1;

        if (conflictos < conflictoActual) {
          mejora = true;
          pasos.push(
            crearPaso(board, size, {
              reinaMovida: queenIndex,
              deCol: colActual,
              aCol: col,
              mensaje: `Reina fila ${queenIndex + 1}: col ${
                colActual + 1
              } -> col ${col + 1} (primera mejora encontrada)`,
            }),
          );
          break;
        }

        board[queenIndex] = colActual;
      }
    }
  }

  return { exito: contarConflictos(board, size) === 0, pasos, final: board };
}

function simulatedAnnealing(boardInicial, size) {
  let board = [...boardInicial];
  let conflictoActual = contarConflictos(board, size);
  let temperatura = size;
  const enfriamiento = 0.97;
  const temperaturaMinima = 0.01;
  const maxIter = 4000;
  let iter = 0;

  const pasos = [
    crearPaso(board, size, {
      conflictos: conflictoActual,
      mensaje: `Tablero inicial - T = ${temperatura.toFixed(2)}`,
    }),
  ];

  while (conflictoActual > 0 && temperatura > temperaturaMinima && iter < maxIter) {
    iter += 1;
    const queenIndex = Math.floor(Math.random() * size);
    const colActual = board[queenIndex];
    let col = Math.floor(Math.random() * size);

    while (col === colActual) {
      col = Math.floor(Math.random() * size);
    }

    const candidato = [...board];
    candidato[queenIndex] = col;
    const conflictoCandidato = contarConflictos(candidato, size);
    const delta = conflictoCandidato - conflictoActual;

    if (delta < 0 || Math.random() < Math.exp(-delta / temperatura)) {
      board = candidato;
      conflictoActual = conflictoCandidato;
      pasos.push(
        crearPaso(board, size, {
          conflictos: conflictoActual,
          reinaMovida: queenIndex,
          deCol: colActual,
          aCol: col,
          mensaje:
            delta < 0
              ? `Reina fila ${queenIndex + 1}: col ${colActual + 1} -> col ${
                  col + 1
                } (mejora, T = ${temperatura.toFixed(2)})`
              : `Reina fila ${queenIndex + 1}: col ${colActual + 1} -> col ${
                  col + 1
                } (acepta empeorar, T = ${temperatura.toFixed(2)})`,
        }),
      );
    }

    temperatura *= enfriamiento;
  }

  return { exito: conflictoActual === 0, pasos, final: board };
}

const ALGORITMOS = {
  simple: {
    nombre: "Escalada simple",
    fn: escaladaSimple,
    desc: "Mueve la primera reina que encuentre una columna con menos conflictos.",
  },
  maxima: {
    nombre: "Maxima pendiente",
    fn: maximaPendiente,
    desc: "Evalua todas las columnas posibles por reina y elige la mejor.",
  },
  sa: {
    nombre: "Simulated Annealing",
    fn: simulatedAnnealing,
    desc: "Acepta algunos movimientos peores mientras baja la temperatura para salir de optimos locales.",
  },
};

function crearTablero(size, randomize = false) {
  return Array.from({ length: size }, () =>
    randomize ? Math.floor(Math.random() * size) : 0,
  );
}

function clampBoardSize(value) {
  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed)) return MIN_SIZE;
  return Math.max(MIN_SIZE, Math.min(MAX_SIZE, parsed));
}

export default function EightQueens() {
  const [size, setSize] = useState(8);
  const [tablero, setTablero] = useState(() => crearTablero(8, true));
  const [algoritmo, setAlgoritmo] = useState("maxima");
  const [pasos, setPasos] = useState(null);
  const [paso, setPaso] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef(null);

  const cambiarSize = (value) => {
    const nextSize = clampBoardSize(value);
    setSize(nextSize);
    setTablero(crearTablero(nextSize));
    setPasos(null);
    setPaso(0);
    setPlaying(false);
  };

  const colocarReina = (fila, col) => {
    if (pasos) return;

    setTablero((current) => {
      const next = [...current];
      next[fila] = col;
      return next;
    });
  };

  const aleatorizar = () => {
    if (pasos) return;
    setTablero(crearTablero(size, true));
  };

  const reiniciarTablero = () => {
    if (pasos) return;
    setTablero(crearTablero(size));
  };

  const resolver = () => {
    clearInterval(timer.current);
    const resultado = ALGORITMOS[algoritmo].fn(tablero, size);
    setPasos(resultado.pasos);
    setPaso(0);
    setPlaying(resultado.pasos.length > 1);
  };

  const editarDeNuevo = () => {
    if (pasos) {
      setTablero(pasos[pasos.length - 1].tablero);
    }

    setPasos(null);
    setPaso(0);
    setPlaying(false);
  };

  useEffect(() => {
    clearInterval(timer.current);

    if (playing && pasos) {
      timer.current = setInterval(() => {
        setPaso((current) => {
          if (current >= pasos.length - 1) {
            setPlaying(false);
            return current;
          }

          return current + 1;
        });
      }, PLAYBACK_SPEED);
    }

    return () => clearInterval(timer.current);
  }, [playing, pasos]);

  const animando = pasos !== null;
  const currentStep = animando ? pasos[paso] : null;
  const tableroMostrado = currentStep?.tablero ?? tablero;
  const conflictosActuales = currentStep?.conflictos ?? contarConflictos(tablero, size);
  const enConflictoActual =
    currentStep?.enConflicto ?? reinasEnConflicto(tablero, size);
  const reinaMovidaActual = currentStep?.reinaMovida ?? -1;
  const esSolucion = conflictosActuales === 0;
  const terminoSinSolucion = animando && paso === pasos.length - 1 && !esSolucion;
  const cellSize = Math.min(54, Math.floor(460 / size));

  const palette = {
    primary: "#1a1a2e",
    secondary: "#2759b0",
    accent: "#e8ac4a",
    muted: "#5f6b7a",
    danger: "#c93535",
    success: "#22c55e",
    moving: "#e0850a",
  };

  const queenColor = (fila) => {
    if (esSolucion) return palette.success;
    if (animando && fila === reinaMovidaActual) return palette.moving;
    if (enConflictoActual.has(fila)) return palette.danger;
    return palette.primary;
  };

  const buttonStyle = {
    border: "1px solid rgba(39, 89, 176, 0.22)",
    borderRadius: "var(--border-radius-md)",
    padding: "7px 13px",
    cursor: "pointer",
    fontSize: "13px",
    color: palette.secondary,
    background: "#ffffff",
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    background: palette.secondary,
    color: "#ffffff",
  };

  return (
    <Layout>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          padding: "1.5rem 1rem",
          background: "#f3f4f6",
          minHeight: "100vh",
        }}
      >
        <h2
          style={{
            margin: "0 0 4px",
            fontSize: "18px",
            fontWeight: 600,
            color: palette.primary,
          }}
        >
          N-Reinas
        </h2>
        <p style={{ margin: "0 0 1.25rem", fontSize: "13px", color: palette.muted }}>
          {animando
            ? "Visualizacion paso a paso"
            : "Coloca una reina por fila y elige el algoritmo para resolver."}
        </p>

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: "0.75rem",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              color: palette.secondary,
            }}
          >
            N =
            <input
              type="number"
              min={MIN_SIZE}
              max={MAX_SIZE}
              value={size}
              onChange={(event) => cambiarSize(event.target.value)}
              style={{
                width: "58px",
                background: "#ffffff",
                border: "1px solid rgba(39, 89, 176, 0.22)",
                color: palette.primary,
                borderRadius: "var(--border-radius-md)",
                padding: "6px 8px",
              }}
            />
          </label>

          {!animando && (
            <>
              <button type="button" onClick={aleatorizar} style={buttonStyle}>
                Aleatorizar
              </button>
              <button type="button" onClick={reiniciarTablero} style={buttonStyle}>
                Reiniciar
              </button>
            </>
          )}
        </div>

        {!animando && (
          <>
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: "0.5rem",
              }}
            >
              <select
                value={algoritmo}
                onChange={(event) => setAlgoritmo(event.target.value)}
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(39, 89, 176, 0.22)",
                  color: palette.primary,
                  borderRadius: "var(--border-radius-md)",
                  padding: "7px 8px",
                  fontSize: "13px",
                }}
              >
                {Object.entries(ALGORITMOS).map(([key, algoritmoData]) => (
                  <option key={key} value={key}>
                    {algoritmoData.nombre}
                  </option>
                ))}
              </select>
              <button type="button" onClick={resolver} style={primaryButtonStyle}>
                Resolver
              </button>
            </div>
            <p
              style={{
                margin: "0 0 1.25rem",
                fontSize: "12px",
                color: palette.muted,
                maxWidth: "520px",
              }}
            >
              {ALGORITMOS[algoritmo].desc}
            </p>
          </>
        )}

        {animando && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: "1.25rem",
            }}
          >
            <button
              type="button"
              onClick={() => setPlaying((current) => !current)}
              style={primaryButtonStyle}
            >
              {playing ? "Pausar" : "Reanudar"}
            </button>
            <button
              type="button"
              onClick={() => {
                setPlaying(false);
                setPaso((current) => Math.max(0, current - 1));
              }}
              disabled={paso === 0}
              style={buttonStyle}
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={() => {
                setPlaying(false);
                setPaso((current) => Math.min(pasos.length - 1, current + 1));
              }}
              disabled={paso === pasos.length - 1}
              style={buttonStyle}
            >
              Siguiente
            </button>
            <button type="button" onClick={editarDeNuevo} style={buttonStyle}>
              Editar de nuevo
            </button>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
          <div
            style={{
              border: "1px solid var(--color-border-secondary)",
              borderRadius: "var(--border-radius-md)",
              overflow: "hidden",
              boxShadow: "0 12px 28px rgba(15, 23, 42, 0.12)",
            }}
          >
            {Array.from({ length: size }, (_, fila) => (
              <div key={fila} style={{ display: "flex" }}>
                {Array.from({ length: size }, (_, col) => {
                  const claro = (fila + col) % 2 === 0;
                  const tieneReina = tableroMostrado[fila] === col;
                  const esMovida = animando && fila === reinaMovidaActual && tieneReina;

                  return (
                    <button
                      type="button"
                      key={col}
                      onClick={() => colocarReina(fila, col)}
                      aria-label={`Fila ${fila + 1}, columna ${col + 1}`}
                      style={{
                        width: cellSize,
                        height: cellSize,
                        border: 0,
                        padding: 0,
                        background: claro ? "#f0d9b5" : "#9b7355",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        outline: esMovida ? `3px solid ${palette.moving}` : "none",
                        outlineOffset: "-3px",
                        cursor: animando ? "default" : "pointer",
                      }}
                    >
                      {tieneReina && (
                        <span
                          style={{
                            fontSize: cellSize * 0.58,
                            lineHeight: 1,
                            color: queenColor(fila),
                            textShadow: "0 1px 4px rgba(0,0,0,0.35)",
                            transition: "color 0.25s",
                            userSelect: "none",
                          }}
                        >
                          {QUEEN}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: "520px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
              fontSize: "13px",
              color: palette.muted,
              marginBottom: "0.65rem",
            }}
          >
            <span>
              {esSolucion ? (
                <strong style={{ color: palette.success }}>
                  Configuracion correcta - 0 conflictos
                </strong>
              ) : (
                <span>
                  Conflictos:{" "}
                  <strong style={{ color: palette.danger }}>{conflictosActuales}</strong>
                </span>
              )}
            </span>
            {animando && <span>{ALGORITMOS[algoritmo].nombre}</span>}
          </div>

          {terminoSinSolucion && (
            <p style={{ margin: "0 0 0.6rem", fontSize: "12px", color: palette.danger }}>
              No se llego a una solucion desde esta posicion. Prueba Simulated
              Annealing, aleatoriza el tablero o editalo manualmente.
            </p>
          )}

          {animando && (
            <p
              style={{
                margin: "0 0 0.65rem",
                fontSize: "13px",
                minHeight: "18px",
                color: esSolucion ? palette.success : palette.primary,
              }}
            >
              {esSolucion ? "Solucion encontrada" : pasos[paso].mensaje}
            </p>
          )}

          {animando ? (
            <>
              <input
                type="range"
                min={0}
                max={pasos.length - 1}
                value={paso}
                onChange={(event) => {
                  setPlaying(false);
                  setPaso(Number.parseInt(event.target.value, 10));
                }}
                style={{ width: "100%", marginBottom: "6px", accentColor: palette.moving }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  color: palette.muted,
                  marginBottom: "1rem",
                }}
              >
                <span>
                  Paso {paso} de {pasos.length - 1}
                </span>
                <span>{pasos.length - 1} movimiento(s)</span>
              </div>
            </>
          ) : (
            <p style={{ margin: "0 0 1rem", fontSize: "12px", color: palette.muted }}>
              Haz clic en una columna de cada fila para mover esa reina.
            </p>
          )}

          <div
            style={{
              display: "flex",
              gap: "16px",
              fontSize: "12px",
              color: palette.muted,
              flexWrap: "wrap",
            }}
          >
            <span>
              <strong style={{ color: palette.primary }}>{QUEEN}</strong> Normal
            </span>
            <span>
              <strong style={{ color: palette.moving }}>{QUEEN}</strong> Moviendo
            </span>
            <span>
              <strong style={{ color: palette.danger }}>{QUEEN}</strong> Conflicto
            </span>
            <span>
              <strong style={{ color: palette.success }}>{QUEEN}</strong> Solucion
            </span>
          </div>
        </div>
      </div>
    </Layout>
  );
}
