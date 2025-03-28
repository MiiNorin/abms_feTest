import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Verify() {
    const [otp, setOtp] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    const formData = location.state || {}; // Nhận object từ Register
    const { email } = formData; // Lấy email từ object

    const handleVerify = async () => {
        const res = await fetch("http://localhost:8080/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, otp }), // Gửi cả formData và otp
        });

        if (res.ok) {
            alert("Đăng ký thành công!");
            navigate("/login"); 
        }
    };

    return (
        <div>
            <h2>Xác nhận OTP</h2>
            <p>Email: {email}</p>
            <input type="text" placeholder="Nhập OTP" onChange={(e) => setOtp(e.target.value)} />
            <button onClick={handleVerify}>Xác nhận</button>
        </div>
    );
}

export default Verify;
