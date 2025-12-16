import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import {
  ShopPanel,
  StockPanel,
  VoucherPanel,
} from "./components/dashboard/panels";
import Login from "./pages/Login";
import ProtectedRoute from "./components/common/Router/ProtectedRoute";
import PublicRoute from "./components/common/Router/PublicRoute";
import MessageProvider from "./store/MessageProvider";
import GlobalLoader from "./store/GlobalLoader";

function App() {
  return (
    <>
      <MessageProvider />
      <GlobalLoader />

      <Router>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "MANAGEMENT", "SELLER"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "MANAGEMENT"]}>
                  <StockPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="ventas"
              element={
                <ProtectedRoute
                  allowedRoles={["SELLER", "MANAGEMENT", "ADMIN"]}
                >
                  <ShopPanel />
                </ProtectedRoute>
              }
            />

            <Route
              path="comprobantes/:id"
              element={
                <ProtectedRoute
                  allowedRoles={["SELLER", "MANAGEMENT", "ADMIN"]}
                >
                  <VoucherPanel />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
