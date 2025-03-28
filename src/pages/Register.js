import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        phone: "",
        password: "",
        re_password: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async () => {
        if (formData.password !== formData.re_password) {
            alert("Mật khẩu nhập lại không khớp!");
            return;
        }

        const res = await fetch("http://localhost:8080/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            navigate("/verify", { state: formData }); // Truyền toàn bộ formData
        } else {
            alert("Đăng ký thất bại!");
        }
    };

    return (
        <div>
            <h2>Đăng ký</h2>
            <input type="text" name="userName" placeholder="Tên đăng nhập" onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} />
            <input type="text" name="phone" placeholder="Số điện thoại" onChange={handleChange} />
            <input type="password" name="password" placeholder="Mật khẩu" onChange={handleChange} />
            <input type="password" name="re_password" placeholder="Nhập lại mật khẩu" onChange={handleChange} />
            <button onClick={handleRegister}>Gửi OTP</button>
        </div>
    );
}

export default Register;
