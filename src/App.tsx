import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Main from "./pages/Main";
import "./app.css";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <Routes>
      <Route path='/'>
        <Route index element={<Main />}></Route>
        <Route path='login' element={<Login />} />
        <Route path='forgot_password' element={<ForgotPassword />} />
        <Route path='reset_password' element={<ResetPassword />} />
      </Route>
    </Routes>
  );
}

export default App;
