import React, { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography, Chip, MenuItem, Select, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, Snackbar, Alert
} from "@mui/material";
import axios from "axios";
import { Box } from "@mui/material";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";

const getStatusColor = (status) => {
    switch (status) {
        case "paid": return "success";
        case "pending": return "warning";
        case "overdue": return "error";
        default: return "default";
    }
};

const ResidentInvoiceList = () => {
    const [invoices, setInvoices] = useState([]);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [selectedBill, setSelectedBill] = useState(null);
    const [open, setOpen] = useState(false);
    const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });
    const [paymentLink, setPaymentLink] = useState("");
    const [isPaymentProcessed, setIsPaymentProcessed] = useState(false);

    const handlePayment = async () => {
        if (!selectedBill) return;
        try {
            const response = await axios.post(`http://localhost:8080/order/create?billId=${selectedBill.billId}`, {
                productName: selectedBill.billContent,
                description: `${selectedBill.billContent} - ${selectedBill.username}`,
                // Đảm bảo rằng returnUrl đúng với status mà PayOS sẽ trả về
                returnUrl: `http://localhost:3000/resident/invoices?billId=${selectedBill.billId}&status=PAID`,
                cancelUrl: `http://localhost:3000/resident/invoices?billId=${selectedBill.billId}&status=failed`,
                price: selectedBill.total,
            });
            if (response.data.error === 0) {
                window.location.href = response.data.data.checkoutUrl;
            } else {
                setAlert({ open: true, message: "Lỗi khi tạo đơn hàng!", severity: "error" });
            }
        } catch (error) {
            console.error("Lỗi thanh toán:", error);
            setAlert({ open: true, message: "Không thể kết nối tới cổng thanh toán!", severity: "error" });
        }
    };
    


    const fetchInvoices = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/bill/view_bill_list?month=${month}&year=${year}`, { withCredentials: true });
            setInvoices(response.data.data || []);
        } catch (error) {
            setAlert({ open: true, message: "Lỗi khi tải hóa đơn!", severity: "error" });
        }
    };

    useEffect(() => { fetchInvoices(); }, [month, year]);

    useEffect(() => {
        console.log("Full URL:", window.location.href);
        const query = new URLSearchParams(window.location.search);
        console.log("All params:", Object.fromEntries(query.entries()));
        const status = query.get("status");
        const billId = query.get("billId");
        
        console.log("Current URL params:", { status, billId }); // Thêm log để debug
        
        // Check if this specific payment has been processed
        const paymentKey = `payment_${billId}_${status}`;
        const alreadyProcessed = localStorage.getItem(paymentKey);
        
        if (!alreadyProcessed && status === "PAID" && billId) {
            console.log("Processing payment for bill:", billId); // Thêm log
            
            // Mark as processed immediately
            localStorage.setItem(paymentKey, "processed");
            
            axios.post("http://localhost:8080/payment/success", {
                billId: billId,
                paymentInfo: "Thanh toán thành công",
            }).then((response) => {
                console.log("Payment success response:", response);
                setAlert({ open: true, message: "Thanh toán thành công!", severity: "success" });
                fetchInvoices(); // Cập nhật danh sách hóa đơn sau khi thanh toán
            }).catch((error) => {
                console.error("Payment error:", error);
                setAlert({ open: true, message: "Lỗi cập nhật thanh toán!", severity: "error" });
            });
        }
    }, [window.location.search]);
    
    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <Header />
                <Box sx={{ flexGrow: 1, p: 3 }}>
                    <Paper sx={{ padding: 2 }}>
                        <Typography variant="h5" gutterBottom>Danh sách hóa đơn</Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Mã Hóa Đơn</TableCell>
                                        <TableCell>Số Tiền</TableCell>
                                        <TableCell>Nội Dung</TableCell>
                                        <TableCell>Trạng Thái</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {invoices.map((invoice) => (
                                        <TableRow key={invoice.billId} onClick={() => { setSelectedBill(invoice); setOpen(true); }} style={{ cursor: "pointer" }}>
                                            <TableCell>{invoice.billId}</TableCell>
                                            <TableCell>{invoice.total.toLocaleString()} VND</TableCell>
                                            <TableCell>{invoice.billContent}</TableCell>
                                            <TableCell>
                                                <Chip label={invoice.status} color={getStatusColor(invoice.status)} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>
            </Box>

            {/* Modal chi tiết hóa đơn */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Chi Tiết Hóa Đơn</DialogTitle>
                <DialogContent>
                    {selectedBill ? (
                        <div>
                            <Typography><strong>Mã Hóa Đơn:</strong> {selectedBill.billId}</Typography>
                            <Typography><strong>Số Tiền:</strong> {selectedBill.total.toLocaleString()} VND</Typography>
                            <Typography><strong>Nội Dung:</strong> {selectedBill.billContent}</Typography>
                            <Typography><strong>Tiền Điện:</strong> {selectedBill.electricBill.toLocaleString()} VND</Typography>
                            <Typography><strong>Tiền Nước:</strong> {selectedBill.waterBill.toLocaleString()} VND</Typography>
                            <Typography><strong>Khác:</strong> {selectedBill.others.toLocaleString()} VND</Typography>
                            <Typography><strong>Trạng Thái:</strong> {selectedBill.status}</Typography>
                            <Typography><strong>Ngày Lập:</strong> {new Date(selectedBill.billDate).toLocaleDateString()}</Typography>
                            <Typography><strong>Người trả:</strong> {selectedBill.username}</Typography>
                        </div>
                    ) : (
                        <Typography>Đang tải...</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Đóng</Button>
                    {selectedBill && selectedBill.status !== "paid" && (
                        <Button variant="contained" color="primary" onClick={handlePayment}>Thanh toán</Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Snackbar thông báo */}
            <Snackbar open={alert.open} autoHideDuration={3000} onClose={() => setAlert({ ...alert, open: false })}>
                <Alert onClose={() => setAlert({ ...alert, open: false })} severity={alert.severity}>{alert.message}</Alert>
            </Snackbar>
        </Box>
    );
};

export default ResidentInvoiceList;  