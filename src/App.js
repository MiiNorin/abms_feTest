import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import InvoiceList from "./components/InvoiceList";
import Login from "./pages/Login";
import ResidentPage from "./pages/ResidentPage";
import ResidentInvoiceList from "./components/ResidentInvoiceList";
import MainPage from "./components/MainPage";
import Profile from "./components/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mainpage" element={<MainPage />} />
        <Route path="/invoices" element={<InvoiceList />} />
        <Route path="/user/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resident" element={<ResidentPage/>}/>
        <Route path="/resident/invoices" element={<ResidentInvoiceList />} />
      </Routes>
    </Router>
  );
}

export default App;
