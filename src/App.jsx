import { HashRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import FrozenLake from "./pages/FrozenLake";
import Sokoban from "./pages/Sokoban";
import TicTacToe from "./pages/TicTacToe";
import EightQueens from "./pages/EightQueens";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/frozenlake" element={<FrozenLake />} />
        <Route path="/sokoban" element={<Sokoban />} />
        <Route path="/eightqueens" element={<EightQueens />} />
        <Route path="/tictactoe" element={<TicTacToe />} />
      </Routes>
    </HashRouter>
  );
}

export default App;