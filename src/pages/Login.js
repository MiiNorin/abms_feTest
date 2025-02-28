import { useState } from "react";
import { login } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box, Alert } from "@mui/material";

function Login() {
    const [userName, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError(null); // Xóa lỗi trước đó
        const result = await login(userName, password);

        if (result === "Login successful") {
            sessionStorage.setItem("loggedInUser", userName);
            navigate("/mainpage");
        } else {
            setError("Tài khoản hoặc mật khẩu không đúng!");
            console.log({ userName, password });

        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2, textAlign: "center" }}>
                <Typography variant="h5" gutterBottom>Đăng nhập</Typography>

                {error && <Alert severity="error">{error}</Alert>}

                <TextField 
                    fullWidth
                    label="Tên đăng nhập" 
                    variant="outlined" 
                    margin="normal" 
                    value={userName} 
                    onChange={(e) => setUsername(e.target.value)} 
                />

                <TextField 
                    fullWidth
                    type="password" 
                    label="Mật khẩu" 
                    variant="outlined" 
                    margin="normal" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />

                <Button 
                    fullWidth 
                    variant="contained" 
                    color="primary" 
                    sx={{ mt: 2 }}
                    onClick={handleLogin}
                >
                    Đăng nhập
                </Button>
            </Box>
        </Container>
    );
}

export default Login;
