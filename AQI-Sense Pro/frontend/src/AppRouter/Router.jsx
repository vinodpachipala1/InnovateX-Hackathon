import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Layout from "../pages/Layout";
import Home from "../pages/Home";
import About from "../pages/About";
const Router = () => {
  return (
    <BrowserRouter>
      
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
   
    </BrowserRouter>
  );
};

export default Router;
