import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const StaffMainPage = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: 2 }}>
      <Typography variant="h4" fontWeight="bold">Trang Nhân Viên</Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
        <Button variant="contained" sx={{ width: 150, height: 60 }} onClick={() => navigate("/bill_manage")}>Quản lý tiêu thụ</Button>
        <Button variant="contained" sx={{ width: 150, height: 60 }}>Mục 2</Button>
        <Button variant="contained" sx={{ width: 150, height: 60 }}>Mục 3</Button>
        <Button variant="contained" sx={{ width: 150, height: 60 }}>Mục 4</Button>
      </Box>
    </Box>
  );
}

export default StaffMainPage;