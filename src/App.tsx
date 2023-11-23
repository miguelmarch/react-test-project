import "./App.css";
import styled from "styled-components";
import { Route, Routes, Navigate } from "react-router-dom";
import { Login } from "./components/login/login";
import { Home } from "./components/home";
import { ForgotPassword } from "./components/ForgotPassword/forgotPassword";
import { CreateUser } from "./components/CreateUser/CreateUser";
import { RequireAuth, useIsAuthenticated } from "react-auth-kit";

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
`;

function App() {
  const isAuthenticated = useIsAuthenticated();
  return (
    <AppContainer>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth loginPath="/login">
              <Home />
            </RequireAuth>
          }
        ></Route>
        <Route
          path="/login"
          element={isAuthenticated() ? <Navigate to="/" /> : <Login />}
        ></Route>
        <Route
          path="/ForgotPassword"
          element={isAuthenticated() ? <Navigate to="/" /> : <ForgotPassword />}
        ></Route>
        <Route
          path="/CreateUser"
          element={isAuthenticated() ? <Navigate to="/" /> : <CreateUser />}
        ></Route>
      </Routes>
    </AppContainer>
  );
}

export default App;
