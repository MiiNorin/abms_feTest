import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import InvoiceList from "./components/InvoiceList";
import Login from "./pages/Login";
import ResidentPage from "./pages/ResidentPage";
import ResidentInvoiceList from "./components/ResidentInvoiceList";
import MainPage from "./components/MainPage";
import Profile from "./components/Profile";
import StaffMainPage from "./pages/StaffMainPage";
import BillManagePage from "./components/staff/BillManagePage";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import VerifyNewResident from "./components/VerifyNewResident";
import VerifyUserIntoResident from "./components/VerifyUserIntoResident";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mainpage" element={<MainPage />} />
        <Route path="/invoices" element={<InvoiceList />} />
        <Route path="/user/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/resident" element={<ResidentPage/>}/>
        <Route path="/verify" element={<Verify />} />
        <Route path="/send_new_resident_info" element={<VerifyNewResident />} />
        <Route path="/verify_resident" element={<VerifyUserIntoResident />} />
        <Route path="/resident/invoices" element={<ResidentInvoiceList />} />
        <Route path="/manage_landing_page" element={<StaffMainPage/>}/>
        <Route path="/bill_manage" element={<BillManagePage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
