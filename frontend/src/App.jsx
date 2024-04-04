import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import { Provider } from "react-redux";
import store from "./redux-store/store.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import UpdatePassword from "./pages/UpdatePassword.jsx";

function App() {
  return (
    <Provider store={store}>
      <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password/:id" element={<UpdatePassword />} />
        </Routes>
      </div>
    </Provider>
  );
}

export default App;
