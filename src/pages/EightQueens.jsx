import { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";

// ─── Algoritmo (fiel al código del usuario) ───────────────────────────────────

function contarConflictos(r, n) {
  let conflictos = 0;
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      if (r[i] === r[j] || Math.abs(i - j) === Math.abs(r[i] - r[j]))
        conflictos++;
  return conflictos;
}

function conflictoReina(r, n, k) {
  let conflictos = 0;
  for (let i = 0; i < n; i++)
    if (i !== k && (r[i] === r[k] || Math.abs(k - i) === Math.abs(r[k] - r[i])))
      conflictos++;
  return conflictos;
}

function hillClimbing(r, n) {
  const reinasConflicto = (board) => {
    const s = new Set();
    for (let i = 0; i < n; i++)
      for (let j = i + 1; j < n; j++)
        if (board[i] === board[j] || Math.abs(i - j) === Math.abs(board[i] - board[j]))
          { s.add(i); s.add(j); }
    return s;
  };

  const pasos = [];
  pasos.push({
    tablero: [...r],
    conflictos: contarConflictos(r, n),
    enConflicto: reinasConflicto(r),
    reinaMovida: -1,
    mensaje: "Estado inicial aleatorio"
  });

  let mejora = true;
  while (mejora) {
    mejora = false;
    for (let k = 0; k < n; k++) {
      const conflictoActual = conflictoReina(r, n, k);
      const colActual = r[k];
      let mejorCol = colActual;
      let mejorConflicto = conflictoActual;

      for (let col = 0; col < n; col++) {
        r[k] = col;
        const c = conflictoReina(r, n, k);
        if (c < mejorConflicto) { mejorConflicto = c; mejorCol = col; }
      }

      r[k] = mejorCol;
      if (mejorCol !== colActual) {
        mejora = true;
        pasos.push({
          tablero: [...r],
          conflictos: contarConflictos(r, n),
          enConflicto: reinasConflicto(r),
          reinaMovida: k,
          deCol: colActual,
          aCol: mejorCol,
          mensaje: `Reina fila ${k + 1}: col ${colActual + 1} → col ${mejorCol + 1}`
        });
      }
    }
  }
  return { exito: contarConflictos(r, n) === 0, pasos };
}

function reinasHillClimbing(n) {
  let intentos = 0;
  while (intentos < 2000) {
    intentos++;
    const r = Array.from({ length: n }, () => Math.floor(Math.random() * n));
    const { exito, pasos } = hillClimbing(r, n);
    if (exito) return { intentos, pasos };
  }
  return null;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function EightQueens() {
  const [n, setN] = useState(6);
  const [pasos, setPasos] = useState(null);
  const [paso, setPaso] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [intentos, setIntentos] = useState(0);
  const VELOCIDAD = 800;
  const timer = useRef(null);

  const ejecutar = () => {
    clearInterval(timer.current);
    const res = reinasHillClimbing(n);
    if (res) {
      setPasos(res.pasos);
      setIntentos(res.intentos);
      setPaso(0);
      setPlaying(true);
    }
  };

  useEffect(() => {
    clearInterval(timer.current);
    if (playing && pasos) {
      timer.current = setInterval(() => {
        setPaso(p => {
          if (p >= pasos.length - 1) { setPlaying(false); return p; }
          return p + 1;
        });
      }, VELOCIDAD);
    }
    return () => clearInterval(timer.current);
  }, [playing, pasos]);

  const actual = pasos?.[paso];
  const CELL = Math.min(54, Math.floor(460 / (n || 6)));
  const esSolucion = actual?.conflictos === 0;
  const conflictosIniciales = pasos?.[0]?.conflictos ?? 1;

  const colorReina = (fila) => {
    if (!actual) return "#1a1a2e";
    if (esSolucion) return "#22c55e";
    if (fila === actual.reinaMovida) return "#e0850a";
    if (actual.enConflicto.has(fila)) return "#c93535";
    return "#1a1a2e";
  };

  const T = { pri: "#b4b7bc", sec: "#2759b0", acc: "#e8ac4a" };

  return (
    <Layout>
    <div style={{ fontFamily: "var(--font-mono)", padding: "1.5rem 1rem", background: "#f3f4f6", minHeight: "100vh" }}>

      <h2 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 500, color: T.acc }}>N-Reinas — Hill Climbing</h2>
      <p style={{ margin: "0 0 1.25rem", fontSize: "13px", color: T.sec }}>
        Visualización del primer intento exitoso
      </p>

      {/* ── Controles ── */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label style={{ fontSize: "13px", color: T.sec }}>N =</label>
          <input
            type="number" min={4} max={12} value={n}
            onChange={e => { setN(Math.max(4, Math.min(12, parseInt(e.target.value) || 6))); setPasos(null); }}
            style={{ width: "56px", background: "rgba(255,255,255,0.08)", border: "0.5px solid rgba(255,255,255,0.2)", color: T.pri, borderRadius: "var(--border-radius-md)", padding: "6px 8px" }}
          />
        </div>
        <button onClick={ejecutar} style={{ background: "#2759b0", border: "0.5px solid rgba(255,255,255,0.3)", color: T.pri, borderRadius: "var(--border-radius-md)", padding: "6px 14px", cursor: "pointer", fontSize: "13px" }}>Ejecutar</button>
        {pasos && (
          <>
            <button onClick={() => setPlaying(p => !p)} style={{ background: "#2759b0", border: "0.5px solid rgba(255,255,255,0.2)", color: T.sec, borderRadius: "var(--border-radius-md)", padding: "6px 14px", cursor: "pointer", fontSize: "13px" }}>{playing ? "Pausar" : "Reanudar"}</button>
            <button onClick={() => { setPlaying(false); setPaso(p => Math.max(0, p - 1)); }} disabled={paso === 0} style={{ background: "transparent", border: "0.5px solid rgba(255,255,255,0.2)", color: T.sec, borderRadius: "var(--border-radius-md)", padding: "6px 12px", cursor: "pointer", fontSize: "13px" }}>◀</button>
            <button onClick={() => { setPlaying(false); setPaso(p => Math.min(pasos.length - 1, p + 1)); }} disabled={paso === pasos.length - 1} style={{ background: "transparent", border: "0.5px solid rgba(255,255,255,0.2)", color: T.sec, borderRadius: "var(--border-radius-md)", padding: "6px 12px", cursor: "pointer", fontSize: "13px" }}>▶</button>
          </>
        )}
      </div>

      {/* ── Tablero ── */}
      {actual && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
          <div style={{ border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-md)", overflow: "hidden" }}>
            {Array.from({ length: n }, (_, fila) => (
              <div key={fila} style={{ display: "flex" }}>
                {Array.from({ length: n }, (_, col) => {
                  const claro = (fila + col) % 2 === 0;
                  const tieneReina = actual.tablero[fila] === col;
                  const esMovida = fila === actual.reinaMovida && tieneReina;
                  return (
                    <div key={col} style={{
                      width: CELL, height: CELL,
                      background: claro ? "#f0d9b5" : "#9b7355",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      outline: esMovida ? "2.5px solid #e0850a" : "none",
                      outlineOffset: "-2.5px",
                    }}>
                      {tieneReina && (
                        <span style={{
                          fontSize: CELL * 0.60, lineHeight: 1,
                          color: colorReina(fila),
                          textShadow: "0 1px 4px rgba(0,0,0,0.35)",
                          transition: "color 0.25s",
                          userSelect: "none"
                        }}>♛</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Panel de info ── */}
      {actual && (
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>

          {/* Barra de progreso */}
          <div style={{ marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: T.sec, marginBottom: "5px" }}>
              <span>Conflictos: <strong style={{ color: esSolucion ? "#22c55e" : "#c93535" }}>{actual.conflictos}</strong></span>
              <span>inicio: {conflictosIniciales}</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "3px", height: "5px", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: conflictosIniciales > 0 ? `${(1 - actual.conflictos / conflictosIniciales) * 100}%` : "100%",
                background: esSolucion ? "#22c55e" : "#e0850a",
                transition: "width 0.4s, background 0.4s",
                borderRadius: "3px"
              }} />
            </div>
          </div>

          {/* Mensaje del paso */}
          <p style={{ margin: "0 0 0.6rem", fontSize: "13px", minHeight: "18px", color: esSolucion ? "#22c55e" : T.pri }}>
            {esSolucion ? "✓ Solución encontrada" : actual.mensaje}
          </p>

          {/* Slider de pasos */}
          <input
            type="range" min={0} max={pasos.length - 1} value={paso}
            onChange={e => { setPlaying(false); setPaso(parseInt(e.target.value)); }}
            style={{ width: "100%", marginBottom: "6px", accentColor: "#e0850a" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: T.sec, marginBottom: "1rem" }}>
            <span>Paso {paso} de {pasos.length - 1}</span>
            {esSolucion && <span>Intento #{intentos} · {pasos.length - 1} movimientos</span>}
          </div>

          {/* Leyenda */}
          <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: T.sec, flexWrap: "wrap" }}>
            <span>♛ Normal</span>
            <span style={{ color: "#e0850a" }}>♛ Moviendo</span>
            <span style={{ color: "#c93535" }}>♛ Conflicto</span>
            <span style={{ color: "#22c55e" }}>♛ Solución</span>
          </div>
        </div>
      )}
    </div>
  </Layout>
  );
}

