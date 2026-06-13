import Layout from "../components/Layout";
import "../styles/home.css";

export default function Home() {
  return (
    <Layout>
      <div className="home-content">

        <div className="home-card">
          <h2>Escuela Superior de Cómputo</h2>
          <h3>01 Evaluación Práctica</h3>

          <p><strong>Profesor:</strong> Rodrigo Roman</p>
          <p><strong>Grupo:</strong> 4BM2</p>

          <h3>Objetivo General</h3>
          <p>
            Desarrollar una aplicación interactiva que permita visualizar y
            comparar algoritmos de búsqueda aplicados a cuatro tipos de problemas.
          </p>

          <h3>Comparación de Problemas</h3>

          <table>
            <thead>
              <tr>
                <th>Tipo de búsqueda</th>
                <th>Problema</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Búsqueda no informada</td>
                <td>Frozen Lake determinista</td>
              </tr>
              <tr>
                <td>Búsqueda informada</td>
                <td>Sokoban</td>
              </tr>
              <tr>
                <td>Búsqueda local</td>
                <td>8 Reinas</td>
              </tr>
              <tr>
                <td>Búsqueda adversaria</td>
                <td>Tic-Tac-Toe</td>
              </tr>
            </tbody>
          </table>

          <h3>Integrantes</h3>
          <ul>
            <li>Cano Nuño Marco Vinicio</li>
            <li>López Reyes Claudia Nicol</li>
            <li>Rodriguez Velazquez Victor Martin</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}