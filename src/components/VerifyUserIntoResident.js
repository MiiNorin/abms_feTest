import React, { useEffect, useState } from "react";
import axios from "axios";

const VerifyUserIntoResident = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/user/list_resident")
            .then(response => {
                setUsers(response.data.data);
            })
            .catch(error => {
                console.error("Lỗi khi lấy dữ liệu:", error);
            });
    }, []);

    const handleApprove = async (user) => {
        const data = {
            verificationFormName: user.verificationFormName,
            fullName: user.fullName || "Chưa cập nhật",
            email: user.email,
            phoneNumber: user.phoneNumber,
            contractStartDate: user.contractStartDate,
            contractEndDate: user.contractEndDate,
            imageFiles: user.imageFiles,
            userRole: user.userRole, 
            verificationFormId: user.verificationFormId,
            verificationFormType: user.verificationFormType,
            apartmentName: user.apartmentName,
            username: user.username,
            verified: true
        };

        console.log("Gửi dữ liệu:", data);

        try {
            const response = await axios.post("http://localhost:8080/user/add", data);
            alert("Duyệt thành công!");
            // Cập nhật UI nếu cần
        } catch (error) {
            console.error("Lỗi khi duyệt:", error);
            alert("Có lỗi xảy ra khi duyệt");
        }
    };


    return (
        <div>
            <h2>Danh sách xác minh</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Tên hợp đồng</th>
                        <th>Họ và tên</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Ngày bắt đầu</th>
                        <th>Ngày kết thúc</th>
                        <th>Hình ảnh</th>
                        <th>Vai trò</th>
                        <th>Căn hộ</th>
                        <th>Tên đăng nhập</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.verificationFormId}>
                            <td>{user.verificationFormName}</td>
                            <td>{user.fullName || "Chưa cập nhật"}</td>
                            <td>{user.email}</td>
                            <td>{user.phoneNumber}</td>
                            <td>{new Date(user.contractStartDate).toLocaleDateString()}</td>
                            <td>{new Date(user.contractEndDate).toLocaleDateString()}</td>
                            <td>
                                {user.imageFiles.map((img, index) => (
                                    <img key={index} src={img} alt="contract" width="50" height="50" />
                                ))}
                            </td>
                            <td>{user.userRole || "N/A"}</td>
                            <td>{user.apartmentName}</td>
                            <td>{user.username}</td>
                            <td>{user.verified ? "Đã duyệt" : "Chưa duyệt"}</td>
                            <td>
                                {!user.verified && (
                                    <button onClick={() => handleApprove(user)}>Duyệt</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VerifyUserIntoResident;