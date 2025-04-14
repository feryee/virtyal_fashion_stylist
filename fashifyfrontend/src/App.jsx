import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Home from "./pages/home";
import ProductDetail from "./pages/detailsPage";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import GetStart from "./pages/getStart";
import HomeLayout from "./layout/HomeLayout";
import AuthLayout from "./layout/AuthLayout";
import Onboard from "./pages/onbaord";
import Collections from "./components/collections";
import RecentActivity from "./pages/recentActivity";
import Result from "./pages/result";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/activity" element={<RecentActivity />} />

          <Route path="/detail/:id" element={<ProductDetail />} />
          <Route path="/getStart" element={<GetStart />} />
          <Route path="/result" element={<Result />} />
        </Route>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="onboard" element={<Onboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
