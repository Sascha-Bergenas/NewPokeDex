import { Route, Routes } from "react-router-dom";
import PokedexPage from "../pages/PokedexPage/PokedexPage";
import PokemonDetailPage from "../pages/PokemonDetailPage/PokemonDetailPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<PokedexPage />} />
      <Route path="/pokemon/:name" element={<PokemonDetailPage />} />
    </Routes>
  );
}
export default AppRouter;
