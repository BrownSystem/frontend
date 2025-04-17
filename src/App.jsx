import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { ShopPanel, StockPanel } from "./components/dashboard/panels";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route path="" element={<StockPanel />} />
          <Route path="ventas" element={<ShopPanel />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
