import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux"; // Import createStore from redux
import rootReducer from "./redux/reducers"; // Import your root reducer
import "./App.css";
import { auth } from "./database/firebase";
import MainIndex from "./pages/MainIndex";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const RegistrationPage = lazy(() => import("./layouts/RegistrationPage"));
const ForgotPassword = lazy(() => import("./layouts/ForgotPassword"));
const LoginPage = lazy(() => import("./layouts/LoginPage"));

// Create Redux store
const store = createStore(rootReducer);

// Function to check if user is authenticated
const isAuthenticated = () => {
  return auth.currentUser !== null;
};

// Private Route component to handle authentication
const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/LoginPage" />;
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Navigate to="/LoginPage" />} />
            <Route path="/LoginPage" element={<LoginPage />} />
            <Route path="/RegistrationPage" element={<RegistrationPage />} />
            <Route path="/ForgotPassword" element={<ForgotPassword />} />
            <Route path="/MainIndex/*" element={<PrivateRoute element={<MainIndex />} />} />
            <Route path="*" element={<Navigate to="/LoginPage" />} />
          </Routes>
        </Suspense>
      </Router>
    </Provider>
  );
}

export default App;
